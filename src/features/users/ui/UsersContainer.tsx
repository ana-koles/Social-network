import { connect } from "react-redux";
import { AppRootStateType } from "../../../redux/redux-store";
import {
  setCurrentPageAC,
  UserType,
  requestUsersTC,
  followUserTC,
  unfollowUserTC,
} from "../model/users-reducer";
import { Component } from "react";
import { Users } from "./Users";
import {
  getCurrentPage,
  getIsFetched,
  getIsFollowingInProgress,
  getPageCount,
  getTotalUsersCount,
  getUsers,
} from "../model/users-selectors";

type MapStateToPropsType = {
  users: UserType[];
  currentPage: number;
  totalUsersCount: number;
  pageCount: number;
  isFetched: boolean;
  isFollowingInProgressUsersId: Array<number>;
};

type MapDispatchToPropsType = {
  setCurrentPage: (currentPage: number) => void;
  getUsers: (pageCount: number, currentPage: number) => void;
  followUser: (userId: number) => void;
  unfollowUser: (userId: number) => void;
};

export type UsersContainerPropsType = MapDispatchToPropsType &
  MapStateToPropsType;

class UsersComponent extends Component<UsersContainerPropsType> {
  constructor(props: UsersContainerPropsType) {
    super(props);
  }

  componentDidMount(): void {
    this.props.getUsers(this.props.pageCount, this.props.currentPage);
  }

  setCurrentPage = (currentPageNumber: number) => {
    this.props.setCurrentPage(currentPageNumber);

    this.props.getUsers(this.props.pageCount, currentPageNumber);
  };

  render() {

    return (
      <Users
        totalUsersCount={this.props.totalUsersCount}
        pageCount={this.props.pageCount}
        currentPage={this.props.currentPage}
        users={this.props.users}
        setCurrentPage={this.setCurrentPage}
        isFetched={this.props.isFetched}
        isFollowingInProgressUsersId={this.props.isFollowingInProgressUsersId}
        followUser={this.props.followUser}
        unfollowUser={this.props.unfollowUser}
      />
    );
  }
}

//используем селекторы
const mapStateToProps = (state: AppRootStateType): MapStateToPropsType => {
  return {
    users: getUsers(state),
    currentPage: getCurrentPage(state),
    totalUsersCount: getTotalUsersCount(state),
    pageCount: getPageCount(state),
    isFetched: getIsFetched(state),
    isFollowingInProgressUsersId: getIsFollowingInProgress(state),
  };
};

/* let mapStateToProps = (state: AppRootStateType): MapStateToPropsType => {
  return {
    users: state.usersPage.users,
    currentPage: state.usersPage.currentPage,
    totalUsersCount: state.usersPage.totalUsersCount,
    pageCount: state.usersPage.pageCount,
    isFetched: state.usersPage.isFetched,
    isFollowingInProgress: state.usersPage.isFollowingInProgress,
  }
}
 */
/* let mapDispatchToProps = (dispatch: Dispatch<UsersPageActionType>): MapDispatchToPropsType => {
  return {
    updateFollow: (userId: number) => { //возможно надо удет исправить на string
      dispatch(UpdateFollowAC(userId))
    },
    setUsers: (users: UserType[]) => {
      dispatch(SetUsersAC(users))
    },
    setCurrentPage: (currentPage: number) => {
      dispatch(SetCurrentPageAC(currentPage))
    },
    setTotalUsersCount: (totalUsersCount: number) => {
      dispatch(SetTotalUsersCountAC(totalUsersCount))
    },
    changeIsFetched: (isFetched: boolean) => {
      dispatch(ChangeIsFetchedAC(isFetched));
    }
  }
} */

export const UsersContainer = connect(mapStateToProps, {
  //Здесь автоматически connect к каждому значению свойства применяет dispatch,
  // создавая таким образом callback как в ф-ции mapDispatchToProps
  setCurrentPage: setCurrentPageAC,
  getUsers: requestUsersTC,
  followUser: followUserTC,
  unfollowUser: unfollowUserTC,
})(UsersComponent);

export default UsersContainer; //обязательно default export доя lazy loading

//еще более короткая версия - нужно будет скорректировать наименования action creators,
//чтобы они соответствовали названиям свойств

/* export const UsersContainer = connect(mapStateToProps, {
  updateFollow,
  setCurrentPage,
  changeIsFetched,
})(UsersComponent); */
