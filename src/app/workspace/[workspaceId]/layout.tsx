'use client'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Sidebar } from './sidebar'
import { Toolbar } from './toolbar'
import { WorkspaceSidebar } from './workspace-sidebar'
import { usePanel } from '@/routes/use-panel'
import { Loader } from 'lucide-react'
import { Id } from '../../../../convex/_generated/dataModel'
import { Thread } from '@/features/messages/components/thread'
import { Profile } from './member/components/profile'

interface WorkspaceIdLayoutProps {
  children: React.ReactNode
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { parentMessageId, onClose, profileMemberId } = usePanel()

  const showPanel = !!parentMessageId || !!profileMemberId
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="ca-workspace-layout"
        >
          <ResizablePanel
            defaultSize={16}
            minSize={15}
            maxSize={24}
            className="bg-[#2c3c5f]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>{children}</ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29} maxSize={34}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<'messages'>}
                    onClose={onClose}
                  />
                ) : profileMemberId ? (
                  <Profile
                    memberId={profileMemberId as Id<'members'>}
                    onClose={onClose}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
export default WorkspaceIdLayout
