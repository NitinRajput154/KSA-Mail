import { redirect } from 'next/navigation';

export default function Login() {
    redirect(process.env.NEXT_PUBLIC_WEBMAIL_URL || 'https://webmail.ksamail.com/');
}
