
# LetterToYou

A brief description of what this project does 

## API's

### Create

Before this letter is scheduled, the api searches for Existing Email. *(Checks whether this user has used the provided email before when using this service)*

This will do one of three things.

- If the Provided Email is used for the first time, A Hashed Uuid is generated of that Email. The Payload is then inserted in Database and a verification url is generated. Then this url is Enqueued in queue with a token of VERIFICATION_EMAIL. A Worker is then assigned which Listens for incoming Jobs and Processes them. Following is the reponse Payload.

- If the Provided Email Exists and is not verified, A verification Url is generated. Then this url is Enqueued in queue with a token of VERIFICATION_EMAIL. A Worker is then assigned which Listens for incoming Jobs and Processes them. Following is the reponse Payload.

- If the Provided Email Exists and is verified, The content is then inserted in Database. Following is the response payload

