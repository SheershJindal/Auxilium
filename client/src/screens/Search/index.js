import React, { useReducer, useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import colors from '../../theme/colors'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import useSearchService from '../../hooks/api/searchService'
import _debounce from 'lodash.debounce'
import _isEmpty from 'lodash.isempty'

const Search = ({ navigation }) => {

  const searchService = useSearchService()

  const [searchTerm, setSearchTerm] = useState("")

  const INITIAL_STATE = { type: "post", data: {}, predictions: [], communities: [], posts: [], comments: [] };

  function reducer(state, action) {
    switch (action.type) {
      case "RESET_STATE":
        return { ...INITIAL_STATE };
      case "SWITCH_POST":
        let predictions;
        predictions = state.data.posts.hits;
        return { ...state, type: "post", predictions };
      case "SWITCH_COMMUNITY":
        predictions = state.data.communities.hits;
        return { ...state, type: "community", predictions };
      case "SWITCH_COMMENT":
        predictions = state.data.comments.hits;
        return { ...state, type: "comment", predictions };
      case "SEARCH":
        const searchHits = action.payload;
        const { communities, posts, comments } = searchHits;
        const activeTab = state.type;
        switch (activeTab) {
          case "post":
            predictions = posts.hits;
            break;
          case "community":
            predictions = communities.hits;
            break;
          case "comment":
            predictions = comments.hits;
            break;
        }
        return { ...state, predictions, data: searchHits, communities: communities.hits, posts: posts.hits, comments: comments.hits };

      default:
        throw Error('Unknown action')
    }
  }
  const customDispatch = async (action) => {
    switch (action.type) {
      case "SEARCH":
        const term = action.payload;
        if (!term) return dispatch({ type: "RESET_STATE" });
        const searchHits = await searchService.getSearchTerm(term);
        action.payload = searchHits;
      default:
        dispatch(action)
    }
  }
  const debouncedFunction = useCallback(_debounce((t) => customDispatch({ type: "SEARCH", payload: t }), 400), []);

  const handleTextInput = (t) => {
    setSearchTerm(t);
    debouncedFunction(t)
  }

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const ActionItem = ({ type, value }) => {
    const action = `SWITCH_${type.toUpperCase()}`
    const onPress = () => {
      customDispatch({ type: action })
    }
    const selected = state.type == type;
    return <TouchableOpacity onPress={onPress} style={{ borderBottomWidth: selected ? 2 : 0, flex: 1, borderColor: colors.primary }}>
      <Text style={{ fontSize: 15, fontWeight: 'bold', color: selected ? colors.primary : 'black', width: '100%', textAlign: 'center' }}>{value}</Text>
    </TouchableOpacity>
  }

  const PredictionItem = ({ prediction }) => {
    const onPress = () =>{
      switch (state.type){
        case "community":
          return navigation.navigate("Community", prediction._id);
        case "post":
          return navigation.navigate("Post", {id:prediction._id});
        case "comment":
          return navigation.navigate("Post", {id:prediction.postId});
      }
    }
    return <TouchableOpacity activeOpacity={0.5} style={{ borderBottomWidth: 1, borderColor: colors.tertiary, paddingBottom: 10, paddingRight: 50, marginVertical: 5, }} onPress={onPress}>
      <Text style={{ fontSize: 15, fontWeight: '600', color: 'black' }}>{prediction.name || prediction.content || prediction.data.content || ""}</Text>
      <Text style={{ color: 'black' }} numberOfLines={1}>Hello</Text>
    </TouchableOpacity>
  }

  return (
    <SafeAreaView style={styles.container} >
      <View style={styles.topContainer}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
            <Ionicons name="arrow-back" size={30} color={colors.secondary} />
          </TouchableOpacity>
          <FontAwesome name='search' size={22} color={colors.secondary} style={styles.searchIcon} />
          <TextInput placeholder='Search for a post, community or comment' autoCapitalize='sentences'
            value={searchTerm} onChangeText={handleTextInput}
            autoCorrect={false} placeholderTextColor={colors.secondary} style={{ ...styles.searchInput, }} autoFocus={true} />
        </View>
        {!_isEmpty(state.data) && <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginHorizontal: 10 }}>
          <ActionItem value="Posts" type="post" />
          <ActionItem value="Community" type="community" />
          <ActionItem value="Comments" type="comment" />
        </View>}
        <ScrollView style={styles.predictionsContainer} overScrollMode="never" keyboardShouldPersistTaps='always'>
          {state.predictions.map(prediction => <PredictionItem prediction={prediction} key={prediction.objectID} />)}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Search

const styles = StyleSheet.create({
  container: { flex: 1 },
  topContainer: { flex: 1 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, borderRadius: 10, marginTop: 10, },
  searchIcon: { marginHorizontal: 10 },
  searchInput: { padding: 10, width: '100%' },
  predictionsContainer: { marginHorizontal: 20, marginTop: 20 },
  errorContainer: { backgroundColor: 'red', minHeight: 50, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: 'white', textAlign: 'center', fontWeight: '600', width: '100%' }
})