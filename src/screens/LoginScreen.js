import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [tel, setTel] = useState('');

  const fazerLogin = async () => {
    const pacoteParaAPI = {
      cpf       : cpf,
      dataNasc  : dataNasc,
      tel       : tel
    };
    
    console.log("Enviando pacote...", pacoteParaAPI);

    try {
      const resposta = await fetch('http://192.168.1.30:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pacoteParaAPI)
      });

      const dados = await resposta.json();

      if (resposta.status === 200) {
        navigation.navigate('Home', { cpf: cpf });
      } else {
        alert(dados.mensagem);
      }
    } catch (error) {
      alert("Erro de conexão.");
    }
  }

  return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.titulo}>NotificaPag</Text>
    <Text style={styles.subtitulo}>Digite seus dados para acessar</Text>
    <TextInput
      style={styles.input}
      placeholder="Digite seu CPF"
      keyboardType="numeric"
      maxLength={11}
      value={cpf}
      onChangeText={setCpf}
    />
    <TextInput
      style={styles.input}
      placeholder="Digite sua data de nascimento"
      keyboardType="numeric"
      maxLength={10}
      value={dataNasc}
      onChangeText={setDataNasc}
    />
    <TextInput
      style={styles.input}
      placeholder="Digite seu telefone"
      keyboardType="numeric"
      value={tel}
      onChangeText={setTel}
    />
    <Button
      title="Entrar no NotificaPag"
      onPress={fazerLogin}
    />
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  }
});
