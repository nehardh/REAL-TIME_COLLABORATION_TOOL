import CollaborativeRoom from '@/components/CollaborativeRoom'
import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'
import { redirect } from 'next/navigation';
import { getDocument } from '@/lib/actions/room.actions'

const Document = async ({ params: { id} }: SearchParamProps) => {
  const clerkUser = await currentUser();
  if(!clerkUser) redirect('/sign-in');

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress, 
  });

  if(!room) redirect('/');

  //TODO: Assess permissions of the user to access the document

  return (
      <main className="flex w-full flex-col items-center">
        <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata} 
        users={[]} currentUserType={'creator'}        
        />
      </main>
  )
}

export default Document