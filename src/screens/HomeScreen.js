import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ route, navigation }) {
    const { cpf } = route.params;
    const [dadosCliente, setDadosCliente] = useState({ nome: '', parcelas: [] });

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        const CACHE_KEY = `@NotificaPag:faturas_${cpf}`

        try {
            const faturasSalvas = await AsyncStorage.getItem(CACHE_KEY);
            if (faturasSalvas !== null) {
                console.log("Dados carregados do Cache local");
                setDadosCliente(JSON.parse(faturasSalvas));
            }
        } catch (error) {
            console.log("Erro ao ler cache local", error);
        }

        try {
            const resposta = await fetch(`http://192.168.1.30:3000/parcelas/${cpf}`);
            
            if (resposta.status === 200) {
                const resultado = await resposta.json();
                console.log("Dados atualizados via API");
                
                setDadosCliente(resultado);

                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(resultado));
            }
        } catch (error) {
            console.log("Dispositivo offline ou API fora do ar. Mantendo cache local.", error);
        }
    };

    const getStatusColor = (status) => {
        if (status === 'paga') return 'green';
        if (status === 'aberta') return '#f1c40f';
        return 'red';
    }

    const fazerLogout = async () => {
        try {
            const CACHE_KEY = `@NotificaPag:faturas_${cpf}`;

            await AsyncStorage.removeItem(`@NotificaPag:cpf`);
            await AsyncStorage.removeItem(CACHE_KEY);
            
            navigation.replace('Login');
        } catch (error) {
            console.log("Erro ao fazer logout", error);
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.boasVindas}>Olá, {dadosCliente.nome}!</Text>
                <Text style={styles.subtitulo}>Veja o resumo das suas faturas abaixo:</Text>
            </View>

            <FlatList
                data={dadosCliente.parcelas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <Text style={styles.textoValor}>R$ {item.valor.toFixed(2)}</Text>
                            <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                                {item.status.toUpperCase()}
                            </Text>
                        </View>
                        <Text style={styles.data}>Vencimento: {item.vencimento}</Text>
                    </View>
                )}
            />

            <View style={styles.botaoSairConta}>
                 <Button title="Sair da Conta" color="#e74c3c" onPress={fazerLogout} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fdfdfd' },
    header: { marginBottom: 25, marginTop: 10 },
    boasVindas: {fontSize: 22, fontWeight: 'bold', color: '#333' },
    subtitulo: { fontSize: 16, color: '#888'},
    card: {
        padding: 18,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    textoValor: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
    status: { fontWeight: 'bold', fontSize: 12 },
    data: { color: '#7f8c8d', marginTop: 8, fontSize: 14 },
    botaoSairConta: { marginTop: 20 }
});