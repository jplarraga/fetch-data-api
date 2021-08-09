const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      // Part 1, step 1 code goes here
      dispatch({ type: 'FETCH_INIT' });
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE'});
        }
      }

    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

// App that gets data from Hacker News url
function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState('Chelsea - Manchester United');
  const [{ isLoading, isError }, doFetch] = useDataApi(
    'https://www.scorebat.com/video-api/v3/search?query=Chelsea - Manchester United',
    {
      response: []
    }
  );
  
  return (
    <Fragment>

      <form
      onSubmit={event => {
        doFetch("https://www.scorebat.com/video-api/v3/search?query=${query}");
        event.preventDefault();
      }}
      >
        <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
        />
      
        <button type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ....</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        // Part 1, step 2 code goes here
        <ul className="list-group">
          {data.response.map((item) => (
            <li key={item} className="list-group-item">
              <a href={item.matchviewUrl}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}

// ========================================
ReactDOM.render(<App />, document.getElementById('root'));
