TOKEN="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"
USERNAME="Bececrazy"
REPO="18yPorn"

git init
git add -A
git commit -m "new commit"
git branch -M main
git remote remove origin
git remote add origin https://$TOKEN@github.com/$USERNAME/$REPO.git
git push -u origin main