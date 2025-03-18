'use client'
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import { Input } from '@/components/ui/input';
import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import React, { useRef, useState } from 'react'
import ActiveCollaborators from './ActiveCollaborators'

const CollaborativeRoom = ({ roomId, roomMetadata }: CollaborativeRoomProps) => {
    const [documentTitle, setdocumentTitle] = useState(roomMetadata.title);
    const [editing, setediting] = useState(false);
    const [loading, setloading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const updateTitleHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {

    }
    
  return (
    <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
            <div className="collaborative-room">
                <Header>
                    <div className="flex w-fit items-center justify-center gap-2">
                        {editing && !loading ? (
                            <Input 
                                type="text"
                                value={ documentTitle }
                                ref={inputRef}
                                placeholder="Enter title"
                                onChange={(e) => setDocumentTitle(e.target.value)}
                                onKeyDown={(e) => {updateTitleHandler}}
                                disable={!editing}
                                className="document-title-input"
                            />
                        ): (
                            <>
                                <p className="document-title">{document.title}</p>
                            </>
                        )}
                    </div>  
                    <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
                        <ActiveCollaborators />
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </Header>
                <Editor />
            </div>
        </ClientSideSuspense>
    </RoomProvider>
  )
}

export default CollaborativeRoom