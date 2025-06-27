import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ResQNetLogo from '../assets/ResQNet logo.jpg';

export default function StartScreen({ navigation }) {
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(1);

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.05,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fadeAnim, scaleAnim]);

    return (
        <LinearGradient
            colors={['#0F172A', '#1E3A8A', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.logoContainer}>
                    <Image
                        source={ResQNetLogo}
                        style={styles.logo}
                    />
                    <View style={styles.logoGlow} />
                </View>
                
                <Text style={styles.title}>Welcome to ResQNet</Text>
                <Text style={styles.subtitle}>
                    Empowering disaster relief coordination with seamless connectivity.
                </Text>
                
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.replace('MainTabs')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#FFD700', '#FFC300']}
                            style={styles.buttonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.buttonText}>Get Started</Text>
                            <View style={styles.buttonIcon}>
                                <Text style={styles.arrow}>→</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
                
                <Text style={styles.footerText}>Disaster Relief Network</Text>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    content: {
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
    },
    logoContainer: {
        position: 'relative',
        marginBottom: 32,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 24,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        zIndex: 2,
    },
    logoGlow: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 28,
        backgroundColor: 'rgba(59, 130, 246, 0.4)',
        top: -10,
        left: -10,
        zIndex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center',
        lineHeight: 40,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#E5E7EB',
        marginBottom: 48,
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '400',
        opacity: 0.9,
        paddingHorizontal: 24,
    },
    button: {
        width: '100%',
        maxWidth: 280,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
        marginBottom: 40,
    },
    buttonGradient: {
        paddingVertical: 18,
        paddingHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#1E3A8A',
        fontWeight: '700',
        textAlign: 'center',
    },
    buttonIcon: {
        marginLeft: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrow: {
        color: '#1E3A8A',
        fontWeight: '800',
        fontSize: 22,
        position:'relative',
        bottom:7,

    },
    footerText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: 24,
        fontWeight: '500',
        letterSpacing: 1,
    },
});