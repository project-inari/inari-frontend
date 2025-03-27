import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '../../utils/firebase';

export default defineEventHandler(async event => {
    const body = await readBody(event);
    const { email, password } = body;

    try {
        const userCredential = await signInWithEmailAndPassword(
            firebaseAuth,
            email,
            password,
        );
        const token = await userCredential.user.getIdToken();

        setCookie(event, 'token', token, { httpOnly: true });
        setCookie(event, 'uid', userCredential.user.uid, { httpOnly: true });
        if (userCredential.user.displayName) {
            setCookie(event, 'username', userCredential.user.displayName, {
                httpOnly: true,
            });
        }

        return { success: true, username: userCredential.user.displayName };
    } catch (error) {
        console.error('Error signing in:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Server error during login.',
        });
    }
});
