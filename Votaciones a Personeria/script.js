document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURACIÓN ---
    const validStudentCodes = ['123', '456', '789', '234', '567', '890', '345', '678', '901', '012', '135', '246', '357', '468', '579', '680', '791', '802', '913', '024'];
    const maxVotes = 20, individualTimeLimit = 60, systemTimeLimit = 300;
    const candidateNames = { "Candidato 1": "Santiago Mateo Villalobos Arce", "Candidato 2": "Isabela Juliana Cifuentes Gómez" };


    // --- ESTADO ---
    let votedStudentCodes = [], votes = { "Candidato 1": 0, "Candidato 2": 0 }, totalVotes = 0;
    let individualVoteTimer, systemVoteTimer, isVotingActive = true, currentVoterCode = null, currentIndividualTime = individualTimeLimit, currentSystemTime = systemTimeLimit;


    // --- ELEMENTOS DEL DOM ---
    const elements = {
        loginSection: document.getElementById('login-section'),
        votingSection: document.getElementById('voting-section'),
        finalResultDisplay: document.getElementById('final-result-display'),
        winnerMessage: document.getElementById('winner-message'),
        studentCodeInput: document.getElementById('student-code'),
        startVoteBtn: document.getElementById('start-vote-btn'),
        loginMessage: document.getElementById('login-message'),
        timerDisplay: document.getElementById('timer'),
        voteForm: document.getElementById('vote-form'),
        submitVoteBtn: document.getElementById('submit-vote-btn'),
        voteMessage: document.getElementById('vote-message'),
        candidateOptions: document.querySelectorAll('.candidate-option'),
        count1Display: document.getElementById('count1'),
        count2Display: document.getElementById('count2'),
        totalVotesDisplay: document.getElementById('total-votes'),
        bar1v: document.getElementById('bar1-v'),
        bar2v: document.getElementById('bar2-v'),
        systemTimeDisplay: document.getElementById('system-time'),
        modalOverlay: document.getElementById('modal-overlay'),
        systemClosedModal: document.getElementById('system-closed-modal'),
        modalMessage: document.getElementById('modal-message'),
        modalCloseBtn: document.getElementById('modal-close-btn')
    };


    // --- FUNCIONES ---
    const showMessage = (element, text, type = 'info') => {
        element.textContent = text;
        element.className = 'message ' + (type === 'error' || type === 'success' ? type : '');
        element.style.display = type === 'error' || type === 'success' ? 'inline-block' : 'none';
        if (type === 'error' || type === 'success') {
            setTimeout(() => { if (element.textContent === text) { element.style.display = 'none'; element.textContent = ''; } }, 4000);
        }
    };


    const updateResultsDisplay = () => {
        elements.count1Display.textContent = votes["Candidato 1"];
        elements.count2Display.textContent = votes["Candidato 2"];
        elements.totalVotesDisplay.textContent = totalVotes;
        const heightPercentage1 = (votes["Candidato 1"] / maxVotes) * 100 || 0;
        const heightPercentage2 = (votes["Candidato 2"] / maxVotes) * 100 || 0;
        elements.bar1v.style.height = `${heightPercentage1}%`;
        elements.bar2v.style.height = `${heightPercentage2}%`;
    };


    const displayFinalResult = () => {
        const votes1 = votes["Candidato 1"], votes2 = votes["Candidato 2"];
        elements.winnerMessage.textContent = votes1 > votes2 ? `EL GANADOR A PERSONERÍA ES: ${candidateNames["Candidato 1"]}` : votes2 > votes1 ? `EL GANADOR A PERSONERÍA ES: ${candidateNames["Candidato 2"]}` : "HA HABIDO UN EMPATE";
        elements.winnerMessage.className = votes1 > votes2 ? 'winner' : votes2 > votes1 ? 'winner' : 'tie';
        elements.finalResultDisplay.style.display = 'block';
    };


    const closeVotingSystem = (reasonMessage) => {
        if (!isVotingActive) return;
        isVotingActive = false;
        clearInterval(individualVoteTimer);
        clearInterval(systemVoteTimer);
        elements.loginSection.style.display = 'none';
        elements.votingSection.style.display = 'none';
        elements.modalMessage.textContent = reasonMessage;
        elements.modalOverlay.style.display = 'block';
        elements.systemClosedModal.style.display = 'block';
        displayFinalResult();
        elements.startVoteBtn.disabled = true;
        elements.submitVoteBtn.disabled = true;
        elements.studentCodeInput.disabled = true;
    };


    const startSystemTimer = () => {
        elements.systemTimeDisplay.textContent = currentSystemTime;
        systemVoteTimer = setInterval(() => {
            if (--currentSystemTime <= 0) closeVotingSystem("El tiempo total para la votación ha expirado.");
            elements.systemTimeDisplay.textContent = currentSystemTime;
        }, 1000);
    };


    const startIndividualTimer = () => {
        currentIndividualTime = individualTimeLimit;
        elements.timerDisplay.textContent = currentIndividualTime;
        clearInterval(individualVoteTimer);
        individualVoteTimer = setInterval(() => {
            if (--currentIndividualTime <= 0) { clearInterval(individualVoteTimer); handleTimeout(); }
            elements.timerDisplay.textContent = currentIndividualTime;
        }, 1000);
    };


    const handleTimeout = () => {
        showMessage(elements.voteMessage, "Ha alcanzado el tiempo límite para votar.", 'error');
        elements.votingSection.style.display = 'none';
        elements.loginSection.style.display = 'block';
        elements.voteForm.reset();
        clearSelectedCandidateStyle();
        currentVoterCode = null;
    };


    const handleStartVote = () => {
        if (!isVotingActive) return;
        const code = elements.studentCodeInput.value.trim();
        showMessage(elements.loginMessage, '', 'info');
        if (!code) return showMessage(elements.loginMessage, "Por favor, ingrese su código de estudiante.", 'error');
        if (!validStudentCodes.includes(code)) return showMessage(elements.loginMessage, "Código inválido. No está autorizado para votar.", 'error');
        if (votedStudentCodes.includes(code)) return showMessage(elements.loginMessage, "Este código ya ha sido utilizado para votar.", 'error');


        currentVoterCode = code;
        showMessage(elements.loginMessage, `Código ${code} verificado. Puede votar.`, 'success');
        elements.studentCodeInput.value = '';
        elements.loginSection.style.display = 'none';
        elements.votingSection.style.display = 'block';
        showMessage(elements.voteMessage, '', 'info');
        clearSelectedCandidateStyle();
        startIndividualTimer();
    };


    const selectCandidate = (candidateId) => {
        const radio = document.getElementById(candidateId);
        if (radio && !radio.disabled) {
            radio.checked = true;
            clearSelectedCandidateStyle();
            radio.closest('.candidate-option').classList.add('selected');
        }
    };


    const clearSelectedCandidateStyle = () => {
        elements.candidateOptions.forEach(option => option.classList.remove('selected'));
    };


    const handleSubmitVote = (event) => {
        event.preventDefault();
        if (!isVotingActive) return;
        const selectedCandidateInput = elements.voteForm.querySelector('input[name="candidato"]:checked');
        if (!selectedCandidateInput) return showMessage(elements.voteMessage, "Debe seleccionar un candidato para enviar su voto.", 'error');


        clearInterval(individualVoteTimer);
        const selectedValue = selectedCandidateInput.value;
        votes[selectedValue]++;
        totalVotes++;
        votedStudentCodes.push(currentVoterCode);
        updateResultsDisplay();
        showMessage(elements.voteMessage, "¡Voto registrado con éxito!", 'success');
        elements.submitVoteBtn.disabled = true;


        setTimeout(() => {
            elements.votingSection.style.display = 'none';
            elements.loginSection.style.display = 'block';
            elements.voteForm.reset();
            clearSelectedCandidateStyle();
            showMessage(elements.voteMessage, '', 'info');
            currentVoterCode = null;
            elements.submitVoteBtn.disabled = false;
        }, 2000);


        if (totalVotes >= maxVotes) setTimeout(() => closeVotingSystem("Se ha alcanzado el número máximo de 20 votos."), 500);
    };


    const closeModal = () => {
        elements.modalOverlay.style.display = 'none';
        elements.systemClosedModal.style.display = 'none';
    };


    // --- INICIALIZACIÓN ---
    elements.startVoteBtn.addEventListener('click', handleStartVote);
    elements.voteForm.addEventListener('submit', handleSubmitVote);
    elements.modalCloseBtn.addEventListener('click', closeModal);
    elements.modalOverlay.addEventListener('click', closeModal);
    elements.studentCodeInput.addEventListener('keypress', (event) => { if (event.key === 'Enter') { event.preventDefault(); handleStartVote(); } });
    elements.candidateOptions.forEach(option => option.addEventListener('click', () => selectCandidate(option.querySelector('input[type="radio"]').id)));


    updateResultsDisplay();
    startSystemTimer();
    elements.loginSection.style.display = 'block';
    elements.votingSection.style.display = 'none';
    elements.finalResultDisplay.style.display = 'none';
    elements.modalOverlay.style.display = 'none';
    elements.systemClosedModal.style.display = 'none';


    console.log("Sistema de votación IEXYZ 2025 inicializado.");
});
