const submit = document.getElementById('submit');
const link = document.getElementById('link');
const result = document.getElementById('result');
link.oninput = function(){
    if(this.value === ''){
        this.removeAttribute('aria-invalid');
    }
    else if(validateInput()){
        this.setAttribute('aria-invalid','false');
    }
    else{
        this.setAttribute('aria-invalid','true');
    }
}
function validateInput(){
    var match = link.value.trim().match(
    /^https?:\/\/(www\.)?threads\.net\/t\/(.+)$/
    );
    return match && match[0];
}
submit.onclick = async function(){
    submit.disabled = true;
    if(link.getAttribute('aria-invalid') !== 'false'){
        alert("Enter Valid Threads URL");
        submit.disabled = false;
        return;
    }
    try{
        result.innerHTML =
        "<p>Loading...</p>";
        var formattedResult = '';
        var url = validateInput();
        var res = await fetch(
        'https://api.threadsdownloader.io/load?url=' + url
        );
        var json = await res.json();
        console.log(json);
        if(json.status != 'OK'){
            throw new Error(json.status);
        }
        var videoCounter = 0;
        json.media.forEach((each)=>{
            if(each.type == 'video'){
                videoCounter++;
                formattedResult += `
                <div class="video-card">
                    <video controls width="100%">
                        <source src="${each.url}">
                    </video>
                    <a href="${each.url}" download>
                        <button class="download-btn">
                        Download Video #${videoCounter}
                        </button>
                    </a>
                </div>`; }
            });
        result.innerHTML = formattedResult;
    }
    catch(error){
        alert("Something Went Wrong");
        console.log(error);
    }
    submit.disabled = false;
}