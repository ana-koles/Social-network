import { Component } from "react";
import { AppRootStateType } from "../../redux/redux-store";
import { Profile } from "./Profile";
import { UserProfileType, savePhotoTC, setProfileTC, setStatusTC, updateStatusTC } from "../../redux/profile-reducer";
import { connect } from "react-redux";
import {  compose } from "redux";
import {  Redirect, RouteComponentProps, withRouter } from "react-router-dom";


type MapStateToPropsType = {
  profile: UserProfileType | null
  status: string
  isAuth: boolean
  authorizedUserId: number | null
}

type MapDispatchToPropsType = {
  setProfile: (userId: number) => void
  setStatus: (userId: number) => void
  updateStatus: (status: string) => void
  savePhoto: (photofile: any) => void
}

//типизация userID
type PathParamsType = {
  userId: string,
}

type OnPropsType = MapStateToPropsType & MapDispatchToPropsType;
type ProfileContainerPropsType = RouteComponentProps<PathParamsType> & OnPropsType;

class ProfileComponent extends Component<ProfileContainerPropsType> {

  refreshProfile() {
    let userId = this.props.match.params.userId;
    if (userId) {
      this.props.setProfile(+userId);
      this.props.setStatus(+userId);
    } else if (!userId && this.props.authorizedUserId) {
        userId = this.props.authorizedUserId.toString();
        this.props.setProfile(+userId);
        this.props.setStatus(+userId);
    } else {
      this.props.history.push('/login') //системый редирект на логин, если нет id пользователя (т.е. когда мы вылогиниваемся)
    }
  }

  componentDidMount(): void {
    this.refreshProfile()
  }

  componentDidUpdate(prevProps: ProfileContainerPropsType): void { //срабатывает каждый раз когда в компоненте меняется state или props
    if (this.props.match.params.userId !== prevProps.match.params.userId) {
      this.refreshProfile()
    }

    if (!this.props.isAuth) {
      this.props.history.push('/login')
    }
  }

  render() {

/*     if (!this.props.isAuth) {
      return <Redirect to="/login" />;
    }
 */
    return (
      <Profile {...this.props}
        status={this.props.status}
        profile={this.props.profile}
        updateStatus={this.props.updateStatus}
        isOwner={!this.props.match.params.userId}
        savePhoto={this.props.savePhoto}
      />
    )
  }
}

//создаем контейнерную компоненту над ProfileComponent (по факту возвращаем 2 контейнерные компоненты над ProfileComponent)
//const  AuthRedirectComponent = withAuthRedirect(ProfileComponent);

const mapStateToProps = (state: AppRootStateType): MapStateToPropsType => {
  return {
    profile: state.profilePage.profile,
    status: state.profilePage.status,
    isAuth: state.auth.isAuth,
    authorizedUserId: state.auth.userId
  }
}

/* const mapDispatchToProps = (dispatch: Dispatch<ProfileReducerActionType>): MapDispatchToPropsType => {
    return {
      setProfile: (userProfile: UserProfileType) => { //возможно надо удет исправить на string
      dispatch(setProfileAC(userProfile))
    }
  }
} */

//тоже вернет новую компоненту, по факту тоже отрисуется ProfileComponent и закинутся данные из URL
//const ProfileComponentWithURLData = withRouter(AuthRedirectComponent);

//connect вернет новую компоненту, по факту отрисуется ProfileComponent и закинет данные из store
//export const ProfileContainer = connect(mapStateToProps, {setProfile: setProfileTC})(ProfileComponentWithURLData)

export const ProfileContainer = compose<React.ComponentType>( //говорим что передаем компоненту
  connect(mapStateToProps, {
    setProfile: setProfileTC,
    setStatus: setStatusTC,
    updateStatus: updateStatusTC,
    savePhoto: savePhotoTC}),
  withRouter,
  //withAuthRedirect
)(ProfileComponent)