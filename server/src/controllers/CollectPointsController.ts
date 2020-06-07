import { Request, Response } from "express";
import knex from "../database/connection";

class CollectPointsController {
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
      image,
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const insertedIds = await trx("collect_points").insert(point);

    const point_id = insertedIds[0];

    const pointItems = items
      .split(",")
      .map((item: string) => item.trim())
      .map((item_id: number) => {
        return {
          item_id,
          point_id,
        };
      });

    await trx("items_collected_by_point").insert(pointItems);

    await trx.commit();

    return response.json({ id: point_id, ...point });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex("collect_points").where("id", id).first();
    const items = await knex("items")
      .join(
        "items_collected_by_point",
        "items.id",
        "=",
        "items_collected_by_point.item_id"
      )
      .where("items_collected_by_point.point_id", id)
      .select("items.title");

    const serializedPoint = {
      ...point,
      ...{ image_url: `http://192.168.100.67:3030/uploads/${point.image}` },
    };

    return point
      ? response.json({ point: serializedPoint, items })
      : response.status(404).json({ message: "Point not found!" });
  }

  async index(request: Request, response: Response) {
    if (Object.keys(request.query).length === 0) {
      const allItems = await knex("collect_points").select("collect_points.*");
      return response.json(allItems);
    }
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex("collect_points")
      .join(
        "items_collected_by_point",
        "point_id",
        "=",
        "items_collected_by_point.point_id"
      )
      .whereIn("items_collected_by_point.item_id", parsedItems)
      .where("city", String(city) || "*")
      .where("uf", String(uf) || "*")
      .distinct()
      .select("collect_points.*");

    const serializedPoints = points.map((point) => {
      return {
        ...point,
        ...{ image_url: `http://192.168.100.67:3030/uploads/${point.image}` },
      };
    });

    return points
      ? response.json(serializedPoints)
      : response.status(404).json({ message: "Not found" });
  }
}

export default CollectPointsController;
