import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const mezclarArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const generarCartas = () => {
    const iconos = [
        'paw', 'paw',
        'heart', 'heart',
        'tree', 'tree',
        'star', 'star',
        'bell', 'bell',
        'gift', 'gift',
        'car', 'car',
        'bicycle', 'bicycle',
        'plane', 'plane',
        'rocket', 'rocket',
        'umbrella', 'umbrella',
        'paperclip', 'paperclip',
        'bomb', 'bomb',
        'cloud', 'cloud',
        'coffee', 'coffee',
    ];

    const iconosMezclados = mezclarArray(iconos);
    return iconosMezclados.map((icono, index) => ({
        id: index,
        simbolo: icono,
        volteada: false,
    }));
};

const Memotest = ({ navigation }) => { 
    const [cartas, setCartas] = useState(generarCartas());
    const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);
    const [parejas, setParejas] = useState(0);
    const [mensajeVictoria, setMensajeVictoria] = useState(new Animated.Value(0));
    const [juegoGanado, setJuegoGanado] = useState(false);

    const manejarClickCarta = (carta) => {
        if (!juegoGanado && cartasSeleccionadas.length < 2 && !carta.volteada) {
            const nuevasCartasSeleccionadas = [...cartasSeleccionadas, carta];
            const nuevasCartas = cartas.map((c) =>
                c.id === carta.id ? { ...c, volteada: true } : c
            );
            setCartasSeleccionadas(nuevasCartasSeleccionadas);
            setCartas(nuevasCartas);

            if (nuevasCartasSeleccionadas.length === 2) {
                if (nuevasCartasSeleccionadas[0].simbolo === nuevasCartasSeleccionadas[1].simbolo) {
                    setParejas(parejas + 1);
                    setCartasSeleccionadas([]);
                    if (parejas + 1 === Math.floor(cartas.length / 2)) {
                        mostrarMensajeVictoria();
                        setJuegoGanado(true);
                    }
                } else {
                    setTimeout(() => {
                        const cartasVolteadas = nuevasCartas.map((c) =>
                            nuevasCartasSeleccionadas.some((s) => s.id === c.id)
                                ? { ...c, volteada: false }
                                : c
                        );
                        setCartasSeleccionadas([]);
                        setCartas(cartasVolteadas);
                    }, 1000);
                }
            }
        }
    };

    const mostrarMensajeVictoria = useCallback(() => {
        Animated.spring(mensajeVictoria, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: false,
        }).start();
    }, [mensajeVictoria]);

    const reiniciarJuego = () => {
        setCartas(generarCartas());
        setCartasSeleccionadas([]);
        setParejas(0);
        setMensajeVictoria(new Animated.Value(0));
        setJuegoGanado(false);
    };

    const mensaje = `Parejas: ${parejas} / ${Math.floor(cartas.length / 2)}`;

    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo1}>Memotest</Text>
            <Text style={styles.titulo2}>Empareja las cartas para ganar!</Text>
            <Text style={styles.textoParejas}>{mensaje}</Text>

            {juegoGanado ? (
                <View style={styles.mensajeVictoria}>
                    <Animated.View style={[styles.contenidoMensajeVictoria, { transform: [{ scale: mensajeVictoria }] }]}>
                        <Text style={styles.textoVictoria}>Ganaste!</Text>
                        <View style={styles.botonesVictoria}>
                            <TouchableOpacity
                                onPress={reiniciarJuego}
                                style={styles.botonReiniciar}
                            >
                                <Icon name="repeat" size={30} color="#fff" />
                                <Text style={styles.textoBoton}>Reiniciar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Home')}
                                style={styles.botonInicio}
                            >
                                <Icon name="home" size={30} color="#fff" />
                                <Text style={styles.textoBoton}>Inicio</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            ) : (
                <View style={styles.grid}>
                    {cartas.map((carta) => (
                        <TouchableOpacity
                            key={carta.id}
                            style={[styles.carta, carta.volteada && styles.cartaVolteada]}
                            onPress={() => manejarClickCarta(carta)}
                        >
                            {carta.volteada ? (
                                <Icon name={carta.simbolo} size={30} style={styles.iconoCarta} />
                            ) : null}
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e0f0',
    },
    titulo1: {
        fontSize: 40,
        marginBottom: 10,
        color: '#3b5998',
        fontWeight: 'bold',
    },
    titulo2: {
        fontSize: 18,
        marginBottom: 20,
        color: '#333333',
    },
    textoParejas: {
        fontSize: 20,
        color: '#3b5998',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    carta: {
        width: 60,
        height: 60,
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#3b5998',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    cartaVolteada: {
        backgroundColor: '#d3d3e8',
    },
    iconoCarta: {
        color: '#3b5998',
    },
    mensajeVictoria: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    contenidoMensajeVictoria: {
        backgroundColor: '#4CAF50',
        padding: 20,
        width: 300,
        height: 300,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textoVictoria: {
        fontSize: 36,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 30,
    },
    botonesVictoria: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    botonReiniciar: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    botonInicio: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    textoBoton: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
    },
});

export default Memotest;
