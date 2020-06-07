import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>("0");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("0");

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") return;
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  const handleSelectUf = (value: string) => {
    const uf = value;
    setSelectedUf(uf);
    if (uf === "0") {
      setSelectedCity("0");
      setCities([]);
    }
  };

  const handleSelectCity = (value: string) => {
    const city = value;
    setSelectedCity(city);
  };

  const navigation = useNavigation();

  const handleNavigateToPoints = () => {
    selectedCity !== "0"
      ? navigation.navigate("Points", { selectedUf, selectedCity })
      : Alert.alert("Erro", "Selecione um estado e uma cidade");
  };

  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.pickerWrapper}>
          <RNPickerSelect
            style={{
              ...pickerStyles,
              iconContainer: {
                top: 10,
                right: 12,
              },
            }}
            onValueChange={handleSelectUf}
            placeholder={{}}
            value={selectedUf}
            items={[
              { label: "Selecione um estado", value: "0" },
              ...ufs.map((uf) => {
                return { label: uf, value: uf };
              }),
            ]}
          />
        </View>

        <View style={styles.pickerWrapper}>
          <RNPickerSelect
            style={{
              ...pickerStyles,
              iconContainer: {
                top: 10,
                right: 12,
              },
            }}
            onValueChange={handleSelectCity}
            placeholder={{}}
            value={selectedCity}
            items={[
              { label: "Selecione uma cidade", value: "0" },
              ...cities.map((city) => {
                return { label: city, value: city };
              }),
            ]}
          />
        </View>
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },

  pickerWrapper: {
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 5,
  },
});

const pickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 6,
    borderColor: "#000",
    borderRadius: 10,
    color: "#34CB79",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 6,
    borderColor: "#000",
    borderRadius: 10,
    color: "#34CB79",
    paddingRight: 30,
  },
});

export default Home;
