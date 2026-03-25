import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ route }) {
    const { cpf } = route.params;

    const [dadosCliente, setDadosCliente] = useState({ nome: '', parcelas: [] });

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const resposta = await fetch(`http://192.168.1.30:3000/parcelas/${cpf}`);
            const resultado = await resposta.json();

            setDadosCliente(resultado);
        } catch (error) {
            console.log("Erro ao buscar dados", error);
        }
    };

    const getStatusColor = (status) => {
        if (status === 'paga') return 'green';
        if (status === 'aberta') return '#f1c40f';
        return 'red';
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
    data: { color: '#7f8c8d', marginTop: 8, fontSize: 14 }
});