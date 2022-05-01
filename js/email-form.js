const template = document.createElement('template');
const endpoint = "https://europe-west1-ecoanswers.cloudfunctions.net/email/"
template.innerHTML =
    `
    <form method="POST" name="emailForm">
        <span id="pre">
            <input aria-label="Email address" placeholder="Email..." id="email" type="email" name="email" required>
            <input aria-label="Submit email" id="submit" type="submit" value="Send"">
        </span>
        <span id="post" class="hidden">
            <h2 class="heading-tagline">Thank you!</h5>
        </span>
    </form>
    
    <style>
        ::selection {
            color: #FBD784;
            background: #color;
        }
        
        form {
            width: 80%;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            margin: auto;
        }
        
        span {
            display: flex;
            min-width: 100%;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            height: 35px;
            font-size: 14px;
        }
        
        span#pre {
            z-index: 1;
        }
        
        span#post {
            position: absolute;
            z-index: 0;
        }
        
        span.hidden {
            display: none;
        }
        
        input#email {
            width: 80%;
            height: 35px;
            flex: 1 1 auto;
            margin: 0;
            padding: 0 10px;
            border: none;
            -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
            -moz-box-sizing: border-box;    /* Firefox, other Gecko */
            box-sizing: border-box;         /* Opera/IE 8+ */
        }
        
        input#submit {    
            height: 35px;
            margin: 0;
            background-color: #FBD784;
            padding: 0;
            border: none;
            outline: none;
            flex: 1 1 100px;
            width: 80%;
            min-width: 100px;
            max-height: 35px;
        }
        
        @media (max-width: 800px) {
            span {
                flex-flow: column nowrap;
                gap: 15px;
            }
        }
    </style>
    `;

class emailForm extends HTMLElement {
    constructor() {
        super();
    }

    /* Called when the element is connected to the page */
    connectedCallback() {
        this.addTemplate();
        this.addListeners();
    }

    disconnectedCallback() {
        // Disconnect listeners and run clean up code.
    }

    static get observedAttributes() {
        return ['attrName', 'anotherAttrName'];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        // ...
    }

    addTemplate(){
        const clone = template.content.cloneNode(true);
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(clone);
    }

    addListeners() {
        let self = this;
        let preSpan = this.shadowRoot.querySelector("#pre");
        let postSpan = this.shadowRoot.querySelector("#post");
        const hidden = "hidden"
        this.shadowRoot.querySelector("form").addEventListener('submit',function(e){
            debugger
            const email = self.shadowRoot.querySelector("#email");
            const formData = new FormData();
            formData.append("email", email.value);

            fetch(endpoint, {
                method: 'POST',
                mode: "cors",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'email': email.value
                })
            })
                .then(response => {
                    // response ok == true -> success
                    // TODO: Change this on backend side. A proper API call should return a response body object on success.
                    if(response.ok === true) {
                        preSpan.classList.add(hidden);
                        postSpan.classList.remove(hidden);
                        return { Success: true}
                    }
                    return response.json();
                })
                .then(data => {
                    // TODO: Read the data object to verify whether the call was successfully made.
                    console.log("Success:", data);
                })
                .catch((error) => console.error(error))

            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    }

    sendEmail() {

    }
}

customElements.define('email-form', emailForm);