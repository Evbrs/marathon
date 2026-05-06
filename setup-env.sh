#!/bin/bash
# Run once to generate .env.local with a custom password
# Usage: bash setup-env.sh

echo "=== Marathon Tracker — Configuration initiale ==="
echo ""
read -s -p "Choisis ton mot de passe d'accès à l'app : " PASSWORD
echo ""

HASH=$(node -e "require('bcryptjs').hash('$PASSWORD', 12).then(h => process.stdout.write(h))" 2>/dev/null)
JWT=$(node -e "process.stdout.write(require('crypto').randomBytes(64).toString('hex'))")

cat > .env.local << EOF
APP_PASSWORD_HASH=$HASH
JWT_SECRET=$JWT

# Rempli automatiquement par : vercel env pull .env.local
BLOB_READ_WRITE_TOKEN=
EOF

echo ""
echo "✅ .env.local créé avec succès !"
echo "   Lance le serveur : npm run dev"
echo "   Ouvre : http://localhost:3000"
echo ""
echo "🔐 Mot de passe de connexion : celui que tu viens de saisir"
