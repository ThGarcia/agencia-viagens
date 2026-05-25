import gif from '../assets/sharon.gif';

export default function WaitResponse() {
    return (
        <div style= {{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', height: '100vh' }}>
            <img src={gif} alt="logo sharon confirmado" />
            <h1>Obrigado, logo entramos em contato!!!</h1>
        </div>
    )
}
