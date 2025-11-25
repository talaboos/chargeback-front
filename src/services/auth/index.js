import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials) {
        const { email, token } = credentials;
        console.log(email, token);

        // const api = new User();
        //
        // const { data } = await api.getUser(token);

        const user = {
          email: 'test@test.com',
          user: 'test',
          subscription: true,
        };

        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],
  session: {
    maxAge: 86400,
  },
  jwt: {
    maxAge: 86400,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        return { ...token, ...session };
      }

      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token;

      return session;
    },

    // async redirect({ url, baseUrl }) {
    //   const isRelativeUrl = url.startsWith('/');
    //   if (isRelativeUrl) {
    //     console.log('1');
    //     return `${baseUrl}${url}`;
    //   }
    //
    //   const isSameOriginUrl = new URL(url).origin === baseUrl;
    //   const alreadyRedirected = url.includes('callbackUrl=');
    //   if (isSameOriginUrl && alreadyRedirected) {
    //     const originalCallbackUrl = decodeURIComponent(url.split('callbackUrl=')[1]);
    //     console.log('2');
    //     return originalCallbackUrl;
    //   }
    //
    //   if (isSameOriginUrl) {
    //     console.log('3');
    //     return url;
    //   }
    //   console.log('4');
    //   return baseUrl;
    // },
  },
  pages: {
    signIn: '/login/2',
  },
};

export default authOptions;
