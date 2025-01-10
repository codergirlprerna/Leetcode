document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");
  
    function validateUsername(username) {
      if (username.trim() === "") {
        alert("Username should not be empty");
        return false;
      }
  
      const regex = /^[a-zA-Z0-9_-]{1,15}$/;
      const isMatching = regex.test(username);
      if (!isMatching) {
        alert("Invalid Username");
      }
      return isMatching;
    }
  
    async function fetchUserDetails(username) {
      try {
        searchButton.textContent = "Searching...";
        searchButton.disabled = true;
  
        const proxyUrl = "https://cors-anywhere.herokuapp.com/";
        const targetUrl = "https://leetcode.com/graphql/";
  
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
  
        const graphql = JSON.stringify({
          query: `
            query userProfileUserQuestionProgressV2($userSlug: String!) {
              userProfileUserQuestionProgressV2(userSlug: $userSlug) {
                numAcceptedQuestions {
                  count
                  difficulty
                }
                numFailedQuestions {
                  count
                  difficulty
                }
                numUntouchedQuestions {
                  count
                  difficulty
                }
                userSessionBeatsPercentage {
                  difficulty
                  percentage
                }
                totalQuestionBeatsPercentage
              }
            }
          `,
          variables: { userSlug: username },
        });
  
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: graphql,
          redirect: "follow",
        };
  
        console.log("Full URL:", proxyUrl + targetUrl);
        console.log("Request Options:", requestOptions);
  
        const response = await fetch(proxyUrl + targetUrl, requestOptions);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const parsedData = await response.json();
        console.log("Data received:", parsedData);

        displayUserData(parsedData);
  
        // Handle the data here (e.g., update the DOM)
        statsContainer.innerHTML = `<p>Data fetched successfully!</p>`;
      } catch (error) {
        console.error("Fetch Error:", error);
        statsContainer.innerHTML = `<p>No data found</p>`;
      } finally {
        searchButton.textContent = "Search";
        searchButton.disabled = false;
      }
    }

    function displayUserData(parsedData){
        const totalQues = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues = parsedData.data.allQuestionsCount[3].count;
    }
  
    searchButton.addEventListener("click", function () {
      const username = usernameInput.value;
      console.log("Logging username:", username);
      if (validateUsername(username)) {
        fetchUserDetails(username);
      }
    });
  });
  