import { useEffect, useRef } from 'react';
import { useSubmit } from 'react-router-dom';
import styled from 'styled-components';

const GoogleButton = ({ clientId, register }) => {
  const googleButton = useRef(null);
  const submit = useSubmit();
  let android = false;

  const handleCredentialResponse = async (response) => {
    const { credential } = response;
    const formData = new FormData();
    formData.append('credential', credential);
    if (!register) {
      const checkbox = Array.from(
        document.querySelectorAll('.input-checkbox')
      )[0].checked;
      formData.append('checkbox', checkbox);
    }
    submit(formData, { method: 'post' });
  };

  useEffect(() => {
    const gB = async (callback, size, oneTap) => {
      let uxMode;
      if (
        navigator.userAgent.includes('Linux; Android') ||
        navigator.userAgent.includes('moto') ||
        navigator.userAgent.includes('samsung')
      ) {
        uxMode = 'redirect';
        android = true;
      } else {
        uxMode = 'popup';
      }

      // android has old libraries. need to implement some alternative
      // https://developers.google.com/identity/sign-in/android/start
      // or do a redirect to a local address
      // so for now do not provide google login button
      if (!android) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback,
          ux_mode: uxMode,
        });
        google.accounts.id.renderButton(
          googleButton.current,
          { type: 'standard', theme: 'outline', size } // customization attributes
        );
        if (oneTap) {
          google.accounts.id.prompt(); // also display the One Tap dialog
        }
      }
    };
    if (register) {
      gB(handleCredentialResponse, 'large', false);
      return;
    }
    gB(handleCredentialResponse, 'large', false);
  }, []);

  return (
    <Wrapper className='google-input'>
      <div ref={googleButton}></div>
      {!android && !register && (
        <input
          type='checkbox'
          name='update-avatar'
          id='update-avatar'
          className='input-checkbox'
        />
      )}
      {!android && !register && (
        <label htmlFor='update-avatar' className='input-avatar'>
          Google avatar
        </label>
      )}
    </Wrapper>
  );
};

export default GoogleButton;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 1rem;

  .input-checkbox {
    margin-left: 1rem;
    padding-left: 0.5rem;
  }
  .input-avatar {
    margin-left: 0.5rem;
    font-size: var(--small-text);
    padding: 0.25rem;
  }
`;
