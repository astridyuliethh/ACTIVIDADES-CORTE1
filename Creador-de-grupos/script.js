document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const studentTableBody = document.getElementById('student-table').querySelector('tbody');
    const groupsContainer = document.getElementById('groups');
    const fileUploadStatus = document.getElementById('file-upload-status');
  
    fileInput.addEventListener('change', handleFileSelect);
  
    function handleFileSelect(event) {
      const file = event.target.files[0];
  
      if (!file) {
        return;
      }
  
      if (file.type !== 'text/csv') {
        fileUploadStatus.textContent = "Archivo no compatible, cargue un archivo CSV";
        fileInput.value = '';
        studentTableBody.innerHTML = '';
        groupsContainer.innerHTML = '';
        return;
      }
  
      fileUploadStatus.textContent = "";
  
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const csvData = event.target.result;
        const students = parseCSV(csvData);
        displayStudents(students);
        createGroups(students);
      };
  
      reader.onerror = () => {
        fileUploadStatus.textContent = "Error al leer el archivo.";
        fileInput.value = '';
        studentTableBody.innerHTML = '';
        groupsContainer.innerHTML = '';
      }
  
      reader.readAsText(file);
    }
  
    function parseCSV(csvData) {
      const lines = csvData.trim().split('\n');
      const students = [];
  
      for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
              const values = line.split(';');
              const apellidosNombres = values[2] ? values[2].trim() : '';
              const genero = values[4] ? values[4].trim() : '';
  
              if (apellidosNombres) {
                  students.push({ name: apellidosNombres, gender: genero });
              }
          }
      }
      return students;
  }
  
  
    function displayStudents(students) {
      studentTableBody.innerHTML = '';
  
      students.forEach(student => {
        const row = document.createElement('tr');
  
        const nameCell = document.createElement('td');
        nameCell.textContent = student.name;
        row.appendChild(nameCell);
  
        const genderCell = document.createElement('td');
        genderCell.textContent = student.gender;
        row.appendChild(genderCell);
  
        studentTableBody.appendChild(row);
      });
    }
  
  
     function createGroups(students) {
      const maleStudents = students.filter(student => student.gender.toLowerCase() === 'm');
      const femaleStudents = students.filter(student => student.gender.toLowerCase() === 'f');
  
      const groups = [];
      let currentGroup = [];
  
      function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
          }
      }
  
      shuffleArray(maleStudents);
      shuffleArray(femaleStudents);
  
      let femaleIndex = 0;
      let maleIndex = 0;
  
       while (femaleIndex < femaleStudents.length || maleIndex < maleStudents.length) {
          currentGroup = [];
          if (femaleIndex < femaleStudents.length) {
              currentGroup.push(femaleStudents[femaleIndex]);
              femaleIndex++;
          }
  
          let malesNeeded = 3 - currentGroup.length;
          for (let i = 0; i < malesNeeded && maleIndex < maleStudents.length; i++) {
              currentGroup.push(maleStudents[maleIndex]);
              maleIndex++;
          }
  
          if (currentGroup.length > 0) {
              groups.push([...currentGroup]);
          }
      }
  
      // Handle incomplete groups
      for (let i = 0; i < groups.length; i++) {
          if (groups[i].length > 3) {
            console.log("Hay un grupo con mas de 3");
          }
      }
      displayGroups(groups);
  }
  
  
    function displayGroups(groups) {
      groupsContainer.innerHTML = '';
  
      groups.forEach((group, index) => {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('group');
  
        const groupTitle = document.createElement('h4');
        groupTitle.textContent = `Grupo ${index + 1}`;
        groupDiv.appendChild(groupTitle);
  
        const groupList = document.createElement('ul');
        group.forEach(student => {
          const listItem = document.createElement('li');
          listItem.textContent = student.name;
          groupList.appendChild(listItem);
        });
  
        groupDiv.appendChild(groupList);
        groupsContainer.appendChild(groupDiv);
      });
    }
  
  
     alert("Suba la lista de estudiantes");
  });