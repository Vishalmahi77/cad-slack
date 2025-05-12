import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useRemoveChannel } from '@/features/channels/api/use-remove-channel'
import { useUpdateChannel } from '@/features/channels/api/use-update-channel'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useChannelId } from '@/utils/use-channel-id'
import { useConfirm } from '@/hooks/use-confirm'
import { useWorkspaceId } from '@/utils/use-workspace-id'
import { Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { toast } from 'sonner'

interface HeaderProps {
  title: string
}

export const Header = ({ title }: HeaderProps) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete this Channel',
    'You are about to delete this channel. This action is irreversible'
  )
  const channelId = useChannelId()
  const { mutate: updateChannel, isPending: isUpdateChannel } =
    useUpdateChannel()
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel()

  const { data: member } = useCurrentMember({ workspaceId })
  const [editOpen, setEditOpen] = useState(false)
  const [value, setValue] = useState(title)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase()
    setValue(value)
  }
  const handleEditOpen = (value: boolean) => {
    if (member?.role !== 'admin') return
    setEditOpen(value)
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateChannel(
      {
        id: channelId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success('Channel updated')
          router.push(`/workspace/${workspaceId}`)
          setEditOpen(false)
        },
        onError: () => {
          toast.error('Failed to update channel')
        },
      }
    )
  }
  const handleDelete = async () => {
    const ok = await confirm()
    if (!ok) return
    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success('Channel Deleted Successfully')
          router.push(`/workspace/${workspaceId}`)
        },
        onError: () => {
          toast.error('Failed to delete channel')
        },
      }
    )
  }
  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
            variant="ghost"
            size="sm"
          >
            <span className="truncate"># {title}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between ">
                    <p className="text-sm font-semibold">Channel name</p>
                    {member?.role === 'admin' && (
                      <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    value={value}
                    disabled={isUpdateChannel}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g balance-diet"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        disabled={isUpdateChannel}
                        className="cursor-pointer"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      disabled={isUpdateChannel}
                      className="cursor-pointer"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === 'admin' && (
              <button
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-700"
                onClick={handleDelete}
                disabled={isRemovingChannel}
              >
                <Trash2Icon className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
