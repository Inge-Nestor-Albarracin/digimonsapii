import { useEffect, useState } from "react";
import { db, auth } from "../app/firebaseConfig";

import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";

import { collection, addDoc } from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

export default function HomeScreen() {
  const [digimons, setDigimons] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);

  const favoritesCollection = collection(db, "favorites");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    fetch("https://digimon-api.vercel.app/api/digimon")
      .then((res) => res.json())
      .then((data) => setDigimons(data))
      .catch((error) => console.log(error));
  }, []);

  async function register() {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Usuario registrado");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function login() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Sesión iniciada");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function saveFavorite(digimon: any) {
    if (!user) {
      alert("Primero inicia sesión");
      return;
    }

    try {
      await addDoc(favoritesCollection, {
        userId: user.uid,
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Login Digimon</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={register}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Digimon App</Text>

      <Text style={styles.userText}>Usuario: {user.email}</Text>

      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </Pressable>

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

            <Pressable style={styles.favoriteButton} onPress={() => saveFavorite(item)}>
              <Text style={styles.buttonText}>Guardar</Text>
            </Pressable>
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
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    backgroundColor: "#f4f4f4",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  userText: {
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  favoriteButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
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
    textAlign: "center",
  },
});