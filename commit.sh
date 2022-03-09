' 
	##### Heroku Commit #####
git config --global user.email "bececrazy2@gmail.com"
git config --global user.name "Bececrazy"

git add .
git commit -am "make it better"
git push heroku master
	##### Heroku Commit #####
'

' ##### Github Commit ##### '
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
