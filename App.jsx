import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const apiKey = '491a4b90071240189b5c1100ea2b3952';

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
      <TextInput
        style={styles.input}
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
        placeholder="Buscar receta..."
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeItem}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
            <Text style={styles.recipeTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
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

  return (
    <View style={styles.container}>
      {recipeDetails && (
        <View style={styles.recipeDetails}>
          <Image source={{ uri: recipeDetails.image }} style={styles.recipeImage} />
          <Text style={styles.recipeDetailTitle}>{recipeDetails.title}</Text>
          <Text style={styles.recipeDetailText}>Ingredientes:</Text>
          {recipeDetails.extendedIngredients.map(ingredient => (
            <Text key={ingredient.id}>{ingredient.original}</Text>
          ))}
          <Text style={styles.recipeDetailText}>Instrucciones:</Text>
          <Text>{recipeDetails.instructions}</Text>
        </View>
      )}
    </View>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    width: '100%',
  },
  recipeImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  recipeTitle: {
    fontSize: 16,
  },
  recipeDetails: {
    flex: 1,
    width: '100%',
    padding: 10,
  },
  recipeDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeDetailText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default App;
