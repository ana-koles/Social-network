import { connect, useDispatch } from "react-redux";
import { AppRootStateType } from "../../redux/redux-store";
import { changeIsFetchedAC, setCurrentPageAC, setTotalUsersCountAC, setUsersAC, updateFollowAC, UserType, toggleIsFollingInProgressAC } from "../../redux/users-reducer";
import { Component } from "react";
import axios from "axios";
import { Users } from "./Users";
import loadingImg from '../../assets/spinning-dots.svg'
import { usersApi } from "../../redux/api";

//типизация стейта
type MapStateToPropsType = {
  users: UserType[],
  currentPage: number
  totalUsersCount: number
  pageCount: number
  isFetched: boolean
  isFollowingInProgress: Array<number>
}



//типизация пропсов
type MapDispatchToPropsType = {
  updateFollow: (userId: number) => void //возможно надо будет исправить на string
  setUsers: (users: UserType[]) => void
  setCurrentPage: (currentPage: number) => void
  setTotalUsersCount: (totalUsersCount: number) => void
  changeIsFetched: (isFetched: boolean) => void
  toggleIsFollingInProgress: (userId: number, isFetched: boolean) => void
}

export type UsersContainerPropsType = MapDispatchToPropsType & MapStateToPropsType;

/* Если вы не определяете конструктор в своем классе, React будет использовать конструктор из базового класса Component, который инициализирует состояние (this.state) и пропсы (this.props).
Этот конструктор, в свою очередь, устанавливает this.props в значения, переданные компоненте в момент создания. */

export class UsersComponent extends Component<UsersContainerPropsType>{


  constructor (props: UsersContainerPropsType) {
    super(props)
/*     if (this.props.users.length === 0) { //чтобы данные загружались сразу при загрузке страницы
      axios.get<UsersGetType>('https://social-network.samuraijs.com/api/1.0/users')
      .then((response) => this.props.setUsers(response.data.items))
    } */
  }

  componentDidMount(): void {
    //чтобы данные загружались сразу при загрузке страницы
      this.props.changeIsFetched(true); //запускаем крутилку

      usersApi.getUsers(this.props.pageCount,this.props.currentPage)
        .then((data) => {
          this.props.changeIsFetched(false); // убираем крутилка

          this.props.setUsers(data.items);
          this.props.setTotalUsersCount(data.totalCount / 500);
        });

  }

  setCurrentPage = (currentPageNumber: number) => {
    this.props.setCurrentPage(currentPageNumber);
    this.props.changeIsFetched(true); //запускаем крутилку

    //здесь в &page=${currentPageNumber}`) нужно именно указывать currentPageNumber
    // а не this.props.currentPAge, потому что к этому момоенту запрос не будет знать обновленное значение currentPage

    usersApi.getUsers(this.props.pageCount,currentPageNumber)
      .then((data) => {
        this.props.changeIsFetched(false); // убираем крутилку
        this.props.setUsers(data.items);
      }
    );
  }

  render () { //обязательно наличие метода render(), чтобы вернуть JSX

    return <Users totalUsersCount={this.props.totalUsersCount}
                  pageCount={this.props.pageCount}
                  currentPage={this.props.currentPage}
                  users={this.props.users}
                  updateFollow={this.props.updateFollow}
                  setCurrentPage={this.setCurrentPage}
                  isFetched={this.props.isFetched}
                  toggleIsFollingInProgress={this.props.toggleIsFollingInProgress}
                  isFollowingInProgress={this.props.isFollowingInProgress}
                  />
  }
}

let mapStateToProps = (state: AppRootStateType): MapStateToPropsType => {
  return {
    users: state.usersPage.users,
    currentPage: state.usersPage.currentPage,
    totalUsersCount: state.usersPage.totalUsersCount,
    pageCount: state.usersPage.pageCount,
    isFetched: state.usersPage.isFetched,
    isFollowingInProgress: state.usersPage.isFollowingInProgress,
  }
}

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
  updateFollow: updateFollowAC,
  setUsers: setUsersAC,
  setCurrentPage: setCurrentPageAC,
  setTotalUsersCount: setTotalUsersCountAC,
  changeIsFetched: changeIsFetchedAC,
  toggleIsFollingInProgress: toggleIsFollingInProgressAC
})(UsersComponent);


//еще более короткая версия - нужно будет скорректировать наименования action creators,
//чтобы они соответствовали названиям свойств

/* export const UsersContainer = connect(mapStateToProps, {
  updateFollow,
  setUsers,
  setCurrentPage,
  setTotalUsersCount,
  changeIsFetched,
})(UsersComponent); */