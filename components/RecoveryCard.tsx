import type { SessionType } from '@/lib/types'

interface Props {
  type: SessionType
  duration?: number
}

const RECO: Record<string, { emoji: string; title: string; items: string[] }> = {
  easy: {
    emoji: '🍌',
    title: 'Récup endurance',
    items: ['Eau + banane', 'Œuf dur ou poignée de noix', 'Repas normal dans l\'heure'],
  },
  long: {
    emoji: '🥤',
    title: 'Récup sortie longue',
    items: [
      'Smoothie : lait d\'avoine + banane + beurre de cacahuète',
      'Glucides rapides dans les 30 min (riz, banane)',
      '130-140g protéines sur la journée (poulet, poisson, œufs)',
      'Hydratation +500ml minimum',
    ],
  },
  interval: {
    emoji: '🥥',
    title: 'Récup fractionné',
    items: [
      'Eau de coco + banane + 2 œufs durs',
      'Repos 48h avant prochaine séance intense',
      'Glucides complexes au repas suivant (patate douce, riz)',
    ],
  },
  threshold: {
    emoji: '🥣',
    title: 'Récup seuil',
    items: [
      'Flocons d\'avoine + lait d\'avoine + miel',
      'Protéines dans les 45 min (œufs, poulet, poisson)',
      'Étirements 10-15 min',
    ],
  },
  strength: {
    emoji: '🍳',
    title: 'Récup renforcement',
    items: [
      'Lait d\'avoine + flocons d\'avoine + miel',
      'Protéines prioritaires : 30-40g post-séance',
      'Hydratation normale',
    ],
  },
  race: {
    emoji: '🎉',
    title: 'Récup course',
    items: [
      'Eau + sel (sodium perdu) dans les 30 min',
      'Repas riche en glucides et protéines dans les 2h',
      'Repos complet 3-5 jours minimum',
      'Pas d\'alcool 48h post-course',
    ],
  },
}

const DEFAULT_RECO = {
  emoji: '💧',
  title: 'Récupération générale',
  items: ['Eau', 'Alimentation équilibrée', 'Sommeil suffisant'],
}

export function RecoveryCard({ type, duration }: Props) {
  const reco = RECO[type] ?? DEFAULT_RECO

  return (
    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{reco.emoji}</span>
        <span className="font-semibold text-emerald-900 text-sm">{reco.title}</span>
        <span className="text-xs text-emerald-600 ml-auto">SCI ✓</span>
      </div>
      <ul className="space-y-1">
        {reco.items.map((item, i) => (
          <li key={i} className="text-sm text-emerald-800 flex gap-1.5">
            <span className="mt-0.5 shrink-0">·</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
