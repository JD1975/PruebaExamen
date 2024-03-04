import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {LinearGradient} from 'expo-linear-gradient';
import HTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

const apiKey = '6eb2aa7b03df49218171dc0c92d0b78d';

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  const fetchDataReceta = async () => {
    try {
      const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          query: searchQuery,
          apiKey: apiKey
        }
      });
      setRecipes(response.data.results.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image
      })));
    } catch (error) {
      console.error('Error fetching:', error);
    }
  };

  const handleSearch = () => {
    fetchDataReceta();
  };
  

  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TheKitchen</Text>

        <TextInput
          style={styles.input}
          onChangeText={text => setSearchQuery(text)}
          value={searchQuery}
          placeholder="Buscar receta..."
          placeholderTextColor="#B4B4B4" 
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>


      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeItem}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
          >

            <View style={styles.homeitems}>
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
              <Text style={styles.recipeTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
      />
    </View>
  );
};

const RecipeDetailScreen = ({ route }) => {
  const { recipeId } = route.params;
  const [recipeDetails, setRecipeDetails] = useState(null);

  const fetchRecipeDetails = async () => {
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
        params: {
          apiKey: apiKey
        }
      });
      setRecipeDetails(response.data);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, []);

  const { width: windowWidth } = useWindowDimensions();
  

  return (
    <LinearGradient
    colors= {['#DDD0D7', '#FFFFFF']} 
    style={{ flex: 1}}
    >
    <ScrollView style={styles.containerScroll}>
      {recipeDetails && (
        
        <View style={styles.recipeDetails}>

          <View style={styles.header}>
            <Text style={styles.title}>TheKitchen</Text>
          </View>
       
          <Image source={{ uri: recipeDetails.image }} style={styles.recipeImageDetails} />
          <Text style={styles.recipeDetailTitle}>{recipeDetails.title}</Text>
          <Text style={styles.recipeDetailText}>Ingredientes:</Text>
          {/* {recipeDetails.extendedIngredients.map(ingredient => (
            <Text key={ingredient.id}>{ingredient.original}</Text>
          ))} */}
          {recipeDetails.extendedIngredients.map((ingredient, index) => (
            <Text style={styles.ingredients} key={`${ingredient.id}-${index}`}>{ingredient.original}</Text>
          ))}

          <Text style={styles.recipeDetailText}>Instrucciones:</Text>
          <HTML source={{ html: recipeDetails.instructions }} contentWidth={windowWidth} style={{paddingLeft: 10}} />
        </View>
      )}
    </ScrollView>
    </LinearGradient>
    
  );
};

const Stack = createStackNavigator();

const App = () => {
 
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          name="TheKitchen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{
      title: 'RecipeDetail',
      headerShown: false 
      
    }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E8E8F9'
  },
  header: {
  backgroundColor: '#40434C',
  color: 'white',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: 30,
  borderBottomLeftRadius: 25,
  borderBottomRightRadius: 25,
  },
  title: {
  marginBottom: 30,
  color: 'white',
  fontSize: 20,
  paddingTop: 20,
  fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'white',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#F46859',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '50%'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  recipeItem: {
    alignItems: 'center',
    width: '50%',
    padding:10,
  
  },
  homeitems: {
    alignItems: 'left',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    width:'100%',

  },
  recipeImage: {
    width: '100%',
    height: 80,
    // marginRight: 10,
    borderRadius: 5,
    marginBottom:5,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  //! DETAILS PART
  
  recipeImageDetails: {
    width: '100%',
    height: 250,
    // marginRight: 10,
    borderRadius: 300,
    marginBottom:20,
    marginTop:20,
  },
  recipeDetails: {
    flex: 1,
    width: '100%',
    // padding: 10,
    // backgroundColor: 'gray'

  },
  recipeDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingLeft: 10,

  },
  recipeDetailText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    paddingLeft: 10,
  },
  ingredients: {
    fontSize: 14,
    paddingLeft: 10,
  },
  containerScroll:{
    flex: 1,
  }
});

export default App;
