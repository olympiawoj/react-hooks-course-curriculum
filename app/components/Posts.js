import React from 'react'
import PropTypes from 'prop-types'
import { fetchMainPosts } from '../utils/api'
import Loading from './Loading'
import PostsList from './PostsList'

function postsReducer(state, action) {
  if (action.type === "fetch") {
    return {
      posts: null,
      error: null,
      loading: true
    }
  } else if (action.type === "success") {
    return {
      loading: false,
      error: null,
      posts: action.posts
    }
  } else if (action.type === "error") {
    return {
      posts: state.posts,
      error: action.error,
      loading: false
    }
  } else {
    console.log('this is an error')
    throw new Error("This action type is not supported")
  }
}

export default function Posts({ type }) {
  const [state, dispatch] = React.useReducer(postsReducer, {
    posts: null, error: null, loading: true
  })


  React.useEffect(() => {
    dispatch({ type: "fetch" })

    fetchMainPosts(type)
      .then((posts) =>
        dispatch({ type: "success", posts })
      )
      .catch(({ message }) =>
        dispatch({ type: "error", error: message })
      )
  }, [type])

  const { posts, error, loading } = state

  if (loading === true) {
    return <Loading />
  }

  if (error) {
    return <p className='center-text error'>{error}</p>
  }

  return <PostsList posts={posts} />
}

// export default class Posts extends React.Component {
//   state = {
//     posts: null,
//     error: null,
//     loading: true,
//   }
//   componentDidMount() {
//     this.handleFetch()
//   }
//   componentDidUpdate(prevProps) {
//     if (prevProps.type !== this.props.type) {
//       this.handleFetch()
//     }
//   }
//   handleFetch() {
//     this.setState({
//       posts: null,
//       error: null,
//       loading: true
//     })

//     fetchMainPosts(this.props.type)
//       .then((posts) => this.setState({
//         posts,
//         loading: false,
//         error: null
//       }))
//       .catch(({ message }) => this.setState({
//         error: message,
//         loading: false
//       }))
//   }
//   render() {
//     const { posts, error, loading } = this.state

//     if (loading === true) {
//       return <Loading />
//     }

//     if (error) {
//       return <p className='center-text error'>{error}</p>
//     }

//     return <PostsList posts={posts} />
//   }
// }

Posts.propTypes = {
  type: PropTypes.oneOf(['top', 'new'])
}