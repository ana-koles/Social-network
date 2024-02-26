import React from 'react';
import s from './Profile.module.css'
import { PostSectionContainer } from './postSection/PostSectionContainer';
import { connect } from 'react-redux';
import { UserProfileType } from '../../redux/profile-reducer';
import photo from '../../assets/cat-profile2.jpg'
import { Preloader } from '../common/Preloader';
import noPhoto from '../../assets/no_photo.jpg'
import { ProfileStatus } from './ProfileStatus';
import { ProfileStatusWithHooks } from './ProfileStatusWithHooks';

type ProfilePropsType = {
  profile: UserProfileType | null
  status: string
  updateStatus: (status: string) => void
}


export const Profile: React.FC<ProfilePropsType> = (props) => {
  console.log('Profile')

  if (!props.profile ) {
    return (<Preloader/>)
  }


  return (
    <div className={s.content}>
        <div className={s.profile_wrapper}>
          <div className ={s.content_wrapper}>
          <div>
            {props.profile.photos.large !== null ? (
              <img className={s.photo} src={props.profile.photos.large} alt="Profile Photo" />
            ) : (
              <img className={s.photo} src={noPhoto} alt="No Profile Photo" />
            )}
            </div>
            <div className={s.info_wrapper}>
              <h2>{props.profile.fullName}</h2>
              <ProfileStatusWithHooks status={props.status} updateStatus={props.updateStatus}/>
              <p>About me: {props.profile.aboutMe}</p>
              <p>Instagram: {props.profile.contacts.instagram}</p>
              <p>Looking for a job: {props.profile.lookingForAJob}</p>
              <p>GitHub: {props.profile.contacts.github}</p>
            </div>
          </div>
        </div>

        <PostSectionContainer /* store={props.store} *//>
    </div>
  );
};

