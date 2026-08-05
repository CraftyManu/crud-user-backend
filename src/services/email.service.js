import { Resend } from 'resend';
import { env } from "../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

export default async function sendWelcomeEmail(user) {
    console.log('function sendWelcomeEmail')
    console.log('user.email: ', user.email)

    const greeting =
        user.genero === "Femenino"
            ? "¡Bienvenida!"
            : "¡Bienvenido!";

    await resend.emails.send({
        from: "UsersApp <onboarding@resend.dev>",
        to: user.email,
        subject: greeting,
        html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="
    margin:0;
    padding:40px;
    background:rgba(172, 177, 246, 0.6);
    font-family:Arial, Helvetica, sans-serif;
    background:
        linear-gradient(rgba(28, 19, 77, 0.6), rgba(255, 255, 255, 0.1)),
        linear-gradient(rgb(6, 4, 21), rgb(18, 11, 37));
    background: #0a0a0a;  
">

    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;">
        <tr>
            <td style="
                padding:40px;
                border-radius:12px;
                box-shadow:0 2px 8px rgba(0,0,0,.08);
                background: #ffffff05;
                border: 1px solid #ffffff0d;
                /*  background: #0a0a0a;  */
            ">

                <h1 style="color:#7564F0">
                    ${greeting}
                </h1>

                <p style="font-size:16px;color:#b2b2b2">
                    Hola <strong>${user.nombre}</strong>,
                </p>

                <p style="font-size:16px;color:#b2b2b2">
                    Tu cuenta en <span style="color:#7564F0">UsersApp</span> ha sido creada correctamente.
                </p>

                <p style="font-size:16px;color:#b2b2b2">
                    Ya puedes iniciar sesión y comenzar a utilizar la aplicación.
                </p>

                <div style="text-align:center;margin-top:35px;">
                    <a href="http://localhost:5173/login" style="
                        background:#7564F0;
                        color:white;
                        padding:13px 20px;
                        border-radius:8px;
                        text-decoration:none;
                        display:inline-block;
                        font-weight:bold;
                        font-size: 18px;
                        background: linear-gradient(180deg, #8B7CF6, #7564F0);
                        box-shadow: 0 12px 30px rgba(139, 124, 246, .35);
                        color: #000;
                    ">
                        Iniciar sesión
                    </a>
                </div>

                <hr style="margin:40px 0;border:none;border-top:1px solid #9b9b9b;">

                <p style="
                    font-size:13px;
                    color:#9b9b9b;
                    text-align:center;
                ">
                    Este es un correo automático. Por favor, no respondas a este mensaje.
                </p>

            </td>
        </tr>
    </table>

</body>
</html>
`
    });

}


