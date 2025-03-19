import Header from '@/components/Header';
import AddDocumentBtn from '@/components/AddDocumentBtn';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';
import { getDocuments } from '@/lib/actions/room.actions';
import Link from 'next/link';
import { dateConverter } from '@/lib/utils';

const page = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect('/sign-in');
    return null; // Prevents further execution
  }

  const userEmail = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!userEmail) {
    return <div>Error: User email not found.</div>; // Handle missing email
  }

  const roomDocuments = await getDocuments(userEmail);

  if (!roomDocuments || !roomDocuments.data) {
    return <div>Error: Could not fetch documents.</div>; // Handle API failure
  }

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          Notification
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>
      {roomDocuments.data.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All Documents</h3>
            <AddDocumentBtn userId={clerkUser.id} email={userEmail} />
          </div>
          <ul className="document-ul">
            {roomDocuments.data.map(({ id, metadata, createdAt }: any) => (
              <li key={id} className="document-list-item">
                <Link href={`/documents/${id}`} className="flex flex-1 items-center gap-4">
                  <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                    <Image src="/assets/icons/doc.svg" alt="Document" width={40} height={40} />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 text-lg">{metadata?.title || 'Untitled Document'}</p>
                    <p className="text-sm font-light text-blue-100">
                      Created {createdAt ? dateConverter(createdAt) : 'Unknown'}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="document-list-empty">
          <Image src="/assets/icons/doc.svg" alt="Document" width={40} height={40} className="mx-auto" />
          <AddDocumentBtn userId={clerkUser.id} email={userEmail} />
        </div>
      )}
    </main>
  );
};

export default page;
