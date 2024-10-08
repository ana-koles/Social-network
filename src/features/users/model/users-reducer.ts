import { Dispatch } from "redux"
import { usersApi } from "../api/usersApi"

export type UsersFilter = {
  term: string
  friend: boolean | null
}

export type UserType = {
  name: string
  id: number
  uniqueUrlName: null
  photos: {
    small: null | string,
    large: null | string
},
  status: null | string,
  followed: boolean
}

export type UsersType = {
  users: UserType[]
  currentPage: number
  totalUsersCount: number
  pageCount: number
  isFetched: boolean
  isFollowingInProgressUsersId: Array<number>
  filter: UsersFilter
}

let usersInitialState: UsersType = {
  users: [/*
    {
      id: v1(),
      photo: photo,
      followed: true,
      name: 'Whiskers',
      status: `Missing my human right meow`,
      location: {
        city: 'Boston',
        country: 'USA'
      }
    },
    {
      id: v1(),
      photo: photo,
      followed: false,
      name: 'Oliver',
      status: `Trying out a new toy today`,
      location: {
        city: 'London',
        country: 'UK'
      }
    },
    {
      id: v1(),
      photo: photo,
      name: 'Leo',
      followed: true,
      status: `Knocked a glass off the table, just to see what would happen`,
      location: {
        city: 'Milan',
        country: 'Italy'
      }
    },
    {
      id: v1(),
      photo: photo,
      name: 'Milo',
      followed: false,
      status: `Just had a gourmet meal of fresh salmon`,
      location: {
        city: 'Rome',
        country: 'Italy'
      }
    }, */
  ],
  currentPage: 1,
  totalUsersCount: 0,
  pageCount: 10,
  isFetched: false,
  isFollowingInProgressUsersId: [],
  filter: {
    term: '',
    friend: null
  }
}

export type UserSearchFilterType = typeof usersInitialState.filter

const UPDATE_FOLLOW = 'UPDATE-FOLLOW';
const SET_USERS = 'SET-USERS';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const SET_TOTAL_USERS_COUNT = 'SET_TOTAL_USERS_COUNT';
const CHANGE_IS_FETCHED = 'CHANGE_IS_FETCHED';
const TOGGLE_IS_FOLLOWING_IN_PROGRESS = 'TOGGLE_IS_FOLLOWING_IN_PROGRESS';
const SET_SEARCH_USERS_FILTER = 'SET_SEARCH_USERS_FILTER'

type UpdateFollowType = ReturnType<typeof updateFollowAC>;
type SetUsersType = ReturnType<typeof setUsersAC>;
type SetCurrentPage = ReturnType<typeof setCurrentPageAC>;
type SetTotalUsersCount = ReturnType<typeof setTotalUsersCountAC>;
type ChangeIsFetchedAT = ReturnType<typeof changeIsFetchedAC>;
type ToggleIsFollowingInProgressAT = ReturnType<typeof toggleIsFollingInProgressAC>;
type SetSearchUsersFilterAT = ReturnType<typeof setUsersSearchFilterAC>;

export type UsersPageActionType = UpdateFollowType
    | SetUsersType
    | SetCurrentPage
    | SetTotalUsersCount
    | ChangeIsFetchedAT
    | ToggleIsFollowingInProgressAT
    | SetSearchUsersFilterAT

export const usersReducer = (state: UsersType = usersInitialState , action: UsersPageActionType): UsersType => {

  switch(action.type) {
    case UPDATE_FOLLOW:
      return  {...state, users: state.users.map(user => user.id === action.userId ? {...user, followed: !user.followed} : user )};

    case SET_USERS:
      return {...state, users: [...action.users]}

    case SET_CURRENT_PAGE:
      return {...state, currentPage: action.currentPage}

    case SET_TOTAL_USERS_COUNT:
      return {...state, totalUsersCount: action.count}

    case CHANGE_IS_FETCHED:
      return {...state, isFetched: action.isFetched};

    case SET_SEARCH_USERS_FILTER:
      return {...state, filter: {...action.payload}};

    case TOGGLE_IS_FOLLOWING_IN_PROGRESS:
      return {...state, isFollowingInProgressUsersId:
          action.isFetched
          ?  [...state.isFollowingInProgressUsersId, action.userId]
          : state.isFollowingInProgressUsersId.filter(id => id !== action.userId)
      }

      default:
        return state;
  }
}

//actions
export const updateFollowAC = (userId: number) => ({type: UPDATE_FOLLOW, userId: userId} as const);

export const setUsersAC = (users: UserType[]) => ({type: SET_USERS, users: users} as const);

export const setCurrentPageAC = (currentPage: number) => {
  return {type: SET_CURRENT_PAGE, currentPage} as const
}

export const setTotalUsersCountAC = (totalUsersCount: number) => {
  return {type: SET_TOTAL_USERS_COUNT, count: totalUsersCount} as const
}

export const changeIsFetchedAC = (isFetched: boolean) => {
  return {type: CHANGE_IS_FETCHED, isFetched} as const;
}

export const toggleIsFollingInProgressAC = (userId: number, isFetched: boolean) => {
  return {type: TOGGLE_IS_FOLLOWING_IN_PROGRESS, userId, isFetched} as const;
}

const setUsersSearchFilterAC = (filter: UsersFilter) => {
  return {type: SET_SEARCH_USERS_FILTER, payload: filter} as const;
}


//thunk

export const requestUsersTC = (pageCount: number, requestedPage: number, filter: UsersFilter) => async(dispatch: Dispatch) => {
  try {
    dispatch(changeIsFetchedAC(true));
    dispatch(setCurrentPageAC(requestedPage));
    let data = await usersApi.getUsers(pageCount, requestedPage, filter.term, filter.friend)
    dispatch(changeIsFetchedAC(false));
    dispatch(setUsersAC(data.items));
    dispatch(setTotalUsersCountAC(data.totalCount));
    dispatch(setUsersSearchFilterAC(filter))
  } catch (error: any) {
    console.log(error.message)
  }
}

export const followUserTC = (userId: number) => async (dispatch: Dispatch) => {
  dispatch(toggleIsFollingInProgressAC(userId, true));

  let data = await usersApi.followUser(userId)
  if (data.resultCode === 0) {
    dispatch(updateFollowAC(userId));
  }
  dispatch(toggleIsFollingInProgressAC(userId, false))
}

export const unfollowUserTC = (userId: number) => async (dispatch: Dispatch) => {
  dispatch(toggleIsFollingInProgressAC(userId, true));

  let data = await usersApi.unfollowUser(userId)
  if (data.resultCode === 0) {
    dispatch(updateFollowAC(userId));
  }
  dispatch(toggleIsFollingInProgressAC(userId, false))
}

