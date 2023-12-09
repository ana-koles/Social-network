import React, { ChangeEvent, useState } from 'react';
import s from './DialogsSection.module.css'
import { MyDialog } from './myDialog/MyDialog';
import { DialogFriend } from './dialogFriend/DialogFriend';
import { ActionType, DialogItemType, MessageContactsType, UserType } from '../../../redux/state';
import { Button } from '../../button/Button';
import { addMessageToDialogAC, updateNewMessageTextAC } from '../../../redux/dialogs-reducer';


type DialogsSectionPropsType = {
  dialog: DialogItemType[]
  currentMessageText: string
  dispatch: (action: ActionType) => void
  user: UserType
  messageContacts: MessageContactsType

}

export const DialogsSection:React.FC<DialogsSectionPropsType> = (props) => {
    //с помощью React.createRef
/*   переменная newPostText будет содержать ссылку на DOM-узел <textarea>, и вы можете
использовать эту ссылку в коде для взаимодействия с этим элементом, таким как получение
 его значения или изменение его свойств.
 */
  const newDialogMessage:React.LegacyRef<HTMLTextAreaElement> = React.createRef();

  const onChangeHandler = () => {
    if (newDialogMessage.current) {
      /* props.updateNewMessageText(newDialogMessage.current.value); */
      /* props.dispatch({type: 'UPDATE-NEW-MESSAGE-TEXT', newText: newDialogMessage.current.value }) */
      props.dispatch(updateNewMessageTextAC(newDialogMessage.current.value))
      console.log('change');
    }
  }

  const addMessageToDialog = () => {
    /* props.addMessageToDialog(); */
    /* props.dispatch({type: 'ADD-MESSAGE-TO-DIALOG'}) */
    props.dispatch(addMessageToDialogAC(props.messageContacts[0].id, props.user.name))
  }

  return (
    <div className = {s.dialog_section}>
        <div className ={s.title_wrapper}>
            <h2>Cat Talks</h2>
        </div>

        {props.dialog.map(d => d.name === 'Fluffy Gangster' ?  <MyDialog dialog={d}/> : <DialogFriend dialog={d}/>)}

        <div className={s.message_input}>
          <textarea
                  ref={newDialogMessage}
                  placeholder='Enter message...'
                  value={props.currentMessageText}
                  onChange={onChangeHandler}>
          </textarea>
          <Button name='post' callback={addMessageToDialog}/>
        </div>
    </div>
  );
};
