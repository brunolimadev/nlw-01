import React, {useEffect, useState, ChangeEvent} from 'react';
import { Feather as Icon} from "@expo/vector-icons";
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse{
  sigla: string;
};

interface IBGECITYResponse{
  nome: string;
};

const Home = () => {

  const navigation = useNavigation();

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(resp => {
        const ufInitials = resp.data.map(uf => uf.sigla);
        setUfs(ufInitials);
    })
}, []);

useEffect(() => {
  if(selectedUf === '0'){
      return
  }
  axios.get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios/`)
  .then(resp => {
      const cityNames = resp.data.map(city => city.nome)
      setCities(cityNames);
  })
  
}, [selectedUf]);

  function handleNavigateToPoints(){
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    })
  }

function handleSelectUf(estado: string){
    const uf = estado;
    console.log(uf);
    setSelectedUf(uf)
}

function handleSelectCity(cidade: string){
    const city = cidade;
    setSelectedCity(city)
}

    return(
        <ImageBackground 
        source={require('../../assets/home-background.png')} 
        imageStyle={{width: 274, height: 368}} 
        style={styles.container}>
          <View style={styles.main}> 
            <Image source={require('../../assets/logo.png')} />
            <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
          <View>
          <View>
            
            <RNPickerSelect 
            placeholder={{
              label: 'Selecione um estado',
              value: null,
              color: '#9EA0A4',
            }}
            onValueChange={(uf) => handleSelectUf(uf)}
            items={ufs.map(uf => (
              {label: uf, value: uf, key:String(uf)}
            ))}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top:5,
                right: 15,
              }
            }}
            />
          </View>
          <View>
            
            <RNPickerSelect 
             placeholder={{
              label: 'Selecione uma cidade',
              value: null,
              color: '#9EA0A4',
            }}
            onValueChange={city => handleSelectCity(city)}
            items={cities.map(city => (
              {label: city, value: city, key:String(city)}
            ))}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top:5,
                right: 15,
              }
            }}
            />
          </View>
          </View>  
          <View style={styles.footer}>
            <RectButton style={styles.button} onPress={handleNavigateToPoints}>
              <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
              </View>
              <Text style={styles.buttonText}>Entrar</Text>
            </RectButton>
          </View>
        </ImageBackground>
    )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    backgroundColor: 'white',
    height: 60,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#666',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    backgroundColor: '#000'
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;