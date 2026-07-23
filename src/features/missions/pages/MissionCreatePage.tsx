import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/Card'
import { useCreateMission } from '../hooks/useCreateMission'
import { MissionForm } from '../components/MissionForm'

export function MissionCreatePage() {
  const navigate = useNavigate()
  const createMission = useCreateMission()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-section font-semibold text-reca-black">Nouvelle mission</h1>
      <Card>
        <MissionForm
          isSubmitting={createMission.isPending}
          onSubmit={(values) =>
            createMission.mutate(values, { onSuccess: (mission) => navigate(`/missions/${mission.id}`) })
          }
          onCancel={() => navigate('/missions')}
        />
      </Card>
    </div>
  )
}
