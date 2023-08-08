import { createTransport } from 'nodemailer'


export const sendMail=async (email,subject,message)=>{
    console.log('En');
    const transporter = createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "113a9d47f71670",
          pass: "0c20c04b87a6c0"}
    })
    const info = await transporter.sendMail({
        from:"113a9d47f71670",
        to: email,
        subject: subject,
        text: message
    })
    console.log();
    console.log('Message sent: %s', info.messageId)

}
