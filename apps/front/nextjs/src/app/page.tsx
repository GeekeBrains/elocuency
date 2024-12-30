import Image from 'next/image';
import styles from './page.module.css';
import { ElocuencyLogo } from 'Elo/media/images/ElocuencyLogo.png';
import { LoginButton } from 'elo/front/react/Components';

export default async function IndexPage() {
  // const router = useRouter();
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>elocuency</h1>
            <Image
              src={ElocuencyLogo}
              alt="Elocuency"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                margin: 'auto',
                display: 'block',
              }}
            />
            <div
              className="text-center" //form-buttons"
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '25px',
              }}
            >
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
