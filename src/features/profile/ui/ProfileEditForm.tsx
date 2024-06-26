import { ContactsType, UserProfileType } from "../modal/profile-reducer";
import {
  Input,
  Textarea,
  createField,
} from "../../../components/common/formContolls/FormControls";
import { InjectedFormProps, reduxForm } from "redux-form";
import { Button } from "../../../components/button/Button";
import s from "./Profile.module.css";

type ProfileEditFormProps = {
  profile: UserProfileType;
  isOwner: boolean;
};

type ProfileFormField = {
  aboutMe: string | null;
  lookingJob: boolean;
  lookingForAJobDescription: string | null;
} & ContactsType;

const ProfileEditForm = (
  props: InjectedFormProps<ProfileFormField, ProfileEditFormProps> &
    ProfileEditFormProps
) => {
  return (
    <form onSubmit={props.handleSubmit} className={s.profileForm}>
      <div className={s.editFormDataWrapper}>
        <label>
          <span>About me:{" "}</span>
          {createField({
            placeholder: "About me...",
            name: "aboutMe",
            component: Textarea,
            validators: [],
          })}
        </label>
        <label>
          <span>Looking for a job:{" "}</span>
          {createField({
            type: "checkbox",
            name: "lookingJob",
            component: Input,
            validators: [],
          })}
        </label>
        <label>
          <span>My professional skills:{" "}</span>
          {createField({
            placeholder: "My professional skills",
            name: "lookingForAJobDescription",
            component: Textarea,
            validators: [],
          })}
        </label>

        {Object.keys(props.profile.contacts).map((key) => {
          let name = key.charAt(0).toUpperCase() + key.slice(1);
          return (
            <label key={key}>
              <span>{name}:{" "}</span>
              {createField({
                type: "text",
                name: "contacts." + key,
                component: Input,
                validators: [],
              })}
            </label>
          );
        })}
      </div>
      {props.error && (
        <div className={s.errorWrapper}>
          <span className={s.error}>{props.error}</span>
        </div>
      )}
      <Button type={"submit"} name={"Save"} />
    </form>
  );
};


export const ProfileEditFormRedux = reduxForm<
  ProfileFormField,
  ProfileEditFormProps
>({
  form: "profile",
})(ProfileEditForm);
