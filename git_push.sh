# Check if a commit message is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 \"Your commit message\""
  exit 1
fi

# Stage all changes
git add .

# Commit changes with the provided message
git commit -m "$1"

# Push changes to the origin on the current branch
git push origin $(git rev-parse --abbrev-ref HEAD)