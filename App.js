import React, { useEffect, useState, Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {
  Container,
  Content,
  List,
  ListItem,
  Text,
  Left,
  Body,
  Right,
  Thumbnail,
  Icon,
  CardItem,
  Button,
  Header,
  ScrollView,
  RefreshControl,
} from 'native-base';
import Constants from 'expo-constants';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useTheme,
} from '@react-navigation/native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import database from '@react-native-firebase/database';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Card } from 'react-native-paper';

import { PacmanIndicator } from 'react-native-indicators';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Cars = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [getCarList, setCarList] = useState([]);

  const removeCar = (id) => {
    Alert.alert('Delete', 'Are you sure you want to delete this item?', [
      {
        text: 'No',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: () => {
          console.log('wazzzzzzzzaaaaaaa' + id);
          var requestOptions = {
            method: 'DELETE',
          };

          fetch(
            'https://lab-terminal--fa18-bcs-018-default-rtdb.firebaseio.com/Cars/' +
              id +
              '.json',
            requestOptions
          )
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log('error', error));
        },
      },
    ]);
  };

  const getCars = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      'https://lab-terminal--fa18-bcs-018-default-rtdb.firebaseio.com/Cars.json',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        let arr = Object.entries(result).map((item) => ({
          ...item[1],
          key: item[0],
        }));
        setCarList(arr);
      })
      .catch((error) => console.log('error', error));
  };

  React.useEffect(() => {
    getCars();
  }, []);

  console.log(getCarList);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddCar', getCarList)}>
          <Ionicons name="add" size={18} color="black" />
        </TouchableOpacity>
      ),
    });
  });

  return (
    <Container style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Content>
        <List
          dataArray={getCarList}
          renderRow={(item) => (
            <ListItem
              avatar
              button
              onPress={() => {
                navigation.navigate('CarDetails', { getCarList: item });
              }}>
              <Left style={{ marginBottom: 10, marginTop: 10 }}>
                <Thumbnail square source={{ uri: item.photo }} />
              </Left>
              <Body>
                <Text style={styles.name}>{item.make}</Text>
                <Text style={{ color: 'white' }}>{item.model}</Text>
                <Text> </Text>

                <Text note style={styles.email}>
                  {item.manufacturing_year}
                </Text>
              </Body>
              <Right>
                <Text> </Text>
                <MaterialIcons
                  name="delete-outline"
                  size={20}
                  color="#f6f6f6"
                  onPress={() => removeCar
              (item.key)}
                />
                <Text> </Text>
              </Right>
            </ListItem>
          )}></List>
      </Content>
    </Container>
  );
};

const CarDetails = ({ navigation, route }) => {
  const { getCarList } = route.params;

  return (
    <Container style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
          style={{ width: '100%', height: '50%', borderRadius: 15 }}
          source={{ uri: getCarList.photo }}
          resizeMode={'contain'}
        />
      <Content padder>
        
        <Card style={styles.card}>
          <CardItem header bordered style={styles.cardComponents}>
            <Text style={styles.cardHeader}>Details</Text>
          </CardItem>

          <CardItem style={styles.cardComponents}>
            <Body>
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={{ fontWeight: 'bold', color: '#f6f6f6' }}>
                  Make:{' '}
                </Text>
                <Text style={{ color: '#f6f6f6' }}> {getCarList.make}</Text>
              </View>

              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={{ fontWeight: 'bold', color: '#f6f6f6' }}>
                  Model:{' '}
                </Text>
                <Text style={{ color: '#f6f6f6' }}> {getCarList.model}</Text>
              </View>

              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={{ fontWeight: 'bold', color: '#f6f6f6' }}>
                  Manufacturing Year:{' '}
                </Text>
                <Text style={{ color: '#f6f6f6' }}>
                  {' '}
                  {getCarList.manufacturing_year}
                </Text>
              </View>

              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={{ fontWeight: 'bold', color: '#f6f6f6' }}>
                  Engine Power:{' '}
                </Text>
                <Text style={{ color: '#f6f6f6' }}>
                  {' '}
                  {getCarList.engine_power} horsepower
                </Text>
              </View>

              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={{ fontWeight: 'bold', color: '#f6f6f6' }}>
                  Color:{' '}
                </Text>
                <Text style={{ color: '#f6f6f6' }}> {getCarList.color}</Text>
              </View>
            </Body>
          </CardItem>
        </Card>
      </Content>
    </Container>
  );
};

const AddCar = ({ navigation, route }) => {
  const { getCarList } = route.params;

  const uploadData = () => {
    var requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        make: make,
        model: model,
        manufacturing_year: year,
        engine_power: engine,
        color: color,
        photo: photo,
      }),
    };

    fetch(
      'https://lab-terminal--fa18-bcs-018-default-rtdb.firebaseio.com/Cars.json',
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  };

  console.log(getCarList);

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engine, setEngine] = useState('');
  const [color, setColor] = useState('');
  const [photo, setPhoto] = useState('');

  return (
    <Container style={styles.container}>
    <View style={{marginHorizontal:75 ,justifyContent: 'center', alignContent: 'center'}}>
      <TextInput
        style={styles.input}
        onChangeText={setMake}
        value={make}
        placeholder="Make"
        placeholderTextColor="white"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        onChangeText={setModel}
        value={model}
        placeholder="Model"
        placeholderTextColor="white"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        onChangeText={setYear}
        value={year}
        placeholder="Manufacturing Year"
        placeholderTextColor="white"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        onChangeText={setEngine}
        value={engine}
        placeholder="Engine Horsepower"
        placeholderTextColor="white"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        onChangeText={setColor}
        value={color}
        placeholder="Color"
        placeholderTextColor="white"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        onChangeText={setPhoto}
        value={photo}
        placeholder="Image URL"
        placeholderTextColor="white"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={{
          backgroundColor: '#d4af37',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 32,
          justifyContent: 'center',
          marginTop: 50,
          width: 150,
          marginLeft: 60
        }}
        onPress={() => uploadData()}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Car</Text>
      </TouchableOpacity>
      </View>
    </Container>
  );
};

const Brands = ({ navigation, route }) => {
  return (
    <Container style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Content>
        <List>
          <ListItem avatar button>
            <Left style={{ marginBottom: 10, marginTop: 10 }}>
              <Thumbnail
                square
                source={{
                  uri:
                    'https://1000logos.net/wp-content/uploads/2018/04/Mercedes-Benz-Logo.png',
                }}
              />
            </Left>
            <Body>
              <Text style={styles.name}>Mercedes</Text>
              <Text> </Text>
              <Text note style={styles.email}></Text>
            </Body>
          </ListItem>

          <ListItem avatar button>
            <Left style={{ marginBottom: 10, marginTop: 10 }}>
              <Thumbnail
                square
                source={{
                  uri:
                    'https://www.carlogos.org/car-logos/bmw-logo.png',
                }}
              />
            </Left>
            <Body>
              <Text style={styles.name}>BMW</Text>
              <Text> </Text>
              <Text note style={styles.email}></Text>
            </Body>
          </ListItem>

          <ListItem avatar button>
            <Left style={{ marginBottom: 10, marginTop: 10 }}>
              <Thumbnail
                square
                source={{
                  uri:
                    'http://car-logos.org/wp-content/uploads/2011/09/volkswagen.png',
                }}
              />
            </Left>
            <Body>
              <Text style={styles.name}>Volkswagen</Text>
              <Text> </Text>
              <Text note style={styles.email}></Text>
            </Body>
          </ListItem>
        </List>
      </Content>
    </Container>
  );
};

function ManageCars({ navigation, route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cars"
        component={Cars}
        options={{
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#c28f2c',
            margin: 5,
            fontSize: 30,
          },
          headerStyle: {
            backgroundColor: '#111111',
            height: 100,
          },
          headerTintColor: '#f6f6f6',
        }}
      />
      <Stack.Screen
        name="CarDetails"
        component={CarDetails}
        options={{
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#c28f2c',
            margin: 5,
            fontSize: 30,
          },
          headerStyle: {
            backgroundColor: '#111111',
            height: 100,
          },
          headerTintColor: '#f6f6f6',
        }}
      />
      <Stack.Screen
        name="AddCar"
        component={AddCar}
        options={{
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#c28f2c',
            margin: 5,
            fontSize: 30,
          },
          headerStyle: {
            backgroundColor: '#111111',
            height: 100,
          },
          headerTintColor: '#f6f6f6',
        }}
      />
    </Stack.Navigator>
  );
}

function ManageBrands({ navigation, route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Brands"
        component={Brands}
        options={{
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#c28f2c',
            margin: 5,
            fontSize: 30,
          },
          headerStyle: {
            backgroundColor: '#111111',
            height: 100,
          },
          headerTintColor: '#f6f6f6',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AppearanceProvider>
      <NavigationContainer theme={DarkTheme}>
        <Drawer.Navigator 
        drawerContentOptions={{
          activeTintColor:'#d4af37',
        }}
          overlayColor="transparent"
          >
          <Drawer.Screen name="Manage Cars" component={ManageCars} l />
          <Drawer.Screen name="Manage Brands" component={ManageBrands} />
        </Drawer.Navigator>
      </NavigationContainer>
    </AppearanceProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1819',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f6f6f6',
  },
  email: {
    color: 'steelblue',
  },
  card: {
    backgroundColor: '#0d1819',
  },
  cardComponents: {
    borderBottomWidth: 1,
    borderBottomColor: '#c28f2c',
    backgroundColor: '#1E383B',
  },
  cardHeader: {
    fontWeight: 'bold',
    color: '#d0a85c',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 100,
    marginRight: 10,
  },
  input: {
    height: 40,
    marginTop: 25,
    padding: 10,
    borderColor: '#d4af37',
    borderBottomWidth: 2,
    width: 270,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    placeholderTextColor: 'white',
    color: 'white',
  },
});
