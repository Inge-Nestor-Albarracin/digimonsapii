import { useEffect, useState } from "react";
import { db } from "../app/firebaseConfig";

import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  StyleSheet,
} from "react-native";

import { collection, addDoc } from "firebase/firestore";

export default function HomeScreen() {
  const [digimons, setDigimons] = useState([]);
  const [search, setSearch] = useState("");

  const favoritesCollection = collection(db, "favorites");

  useEffect(() => {
    fetch("https://digimon-api.vercel.app/api/digimon")
      .then((res) => res.json())
      .then((data) => setDigimons(data));
  }, []);

  async function saveFavorite(digimon: any) {
    try {
      await addDoc(favoritesCollection, {
        name: digimon.name,
        img: digimon.img,
        level: digimon.level,
      });

      alert("Guardado en Firebase");
    } catch (error) {
      console.log(error);
    }
  }

  const filtered = digimons.filter((d: any) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Digimon App</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar Digimon..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item: any) => item.name}
        numColumns={2}
        renderItem={({ item }: any) => (
          <View style={styles.card}>
            <Image source={{ uri: item.img }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.level}</Text>

            <Text style={styles.button} onPress={() => saveFavorite(item)}>
              Guardar
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: "#f4f4f4",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },

  card: {
    flex: 1,
    backgroundColor: "white",
    margin: 8,
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
  },

  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  name: {
    fontWeight: "bold",
    marginTop: 10,
  },

  button: {
    backgroundColor: "#2563eb",
    color: "white",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
    fontWeight: "bold",
  },
});