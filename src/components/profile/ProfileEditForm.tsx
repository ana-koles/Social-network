import { ContactsType, UserProfileType } from "../../redux/profile-reducer"
import { Input, Textarea, createField } from "../common/formContolls/FormControls"
import { InjectedFormProps, reduxForm } from "redux-form"
import { Button } from "../button/Button"
import s from './Profile.module.css'

type ProfileEditFormProps = {
  profile: UserProfileType
  isOwner: boolean
}

type  ProfileFormField = {
  aboutMe: string | null
  lookingJob: boolean
  lookingForAJobDescription: string | null
} & ContactsType


const ProfileEditForm = (props: InjectedFormProps<ProfileFormField, ProfileEditFormProps> & ProfileEditFormProps) => {

  return (
    <form onSubmit={props.handleSubmit} className={s.profileForm}>
        <div>
          <label>About me: {createField({placeholder: 'About me...', name: 'aboutMe', component: Textarea, validators: []})}</label>
          <label>Looking for a job: {createField({type: 'checkbox', name: 'lookingJob', component: Input, validators: []})}</label>
          <label>My professional skills: {createField({placeholder: 'My professional skills', name: 'lookingForAJobDescription', component: Textarea, validators: [] })}</label>
          {Object.keys(props.profile.contacts).map(key => {
            let name = key.charAt(0).toUpperCase() + key.slice(1);
            console.log(name)
            return (
              <label>{name}: {createField({type: 'text', name: key, component: Input, validators: []})}</label>
            )
          })}
        </div>
      <Button type={'submit'} name={'Save'}/>
  </form>
  )
}

//оборачиваем форму контейнерной компонентой (HOC)
export const ProfileEditFormRedux = reduxForm<ProfileFormField, ProfileEditFormProps>({
  form: 'profile', //присваиваем уникальное название форме
})(ProfileEditForm)
