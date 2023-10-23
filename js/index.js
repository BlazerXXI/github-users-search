const mainInput = document.querySelector(".main__input");
const mainBtn = document.querySelector(".main__button");
const mainList = document.querySelector(".main__list");

const url = "https://api.github.com/users/";

mainInput.value = localStorage.getItem("mainInput") || "";

const fetchFunc = () => {
	if (mainInput.value === "") return;
	localStorage.setItem("mainInput", mainInput.value);
	fetch(url + mainInput.value)
		.then((response) => response.json())
		.then((user) => {
			mainList.innerHTML = "";

			const userItem = document.createElement("li");
			userItem.className = "main__user";
			userItem.innerHTML = `
							<div class="main__name">
									<a target="_blank" href="${user.html_url}">
											<img class="main__avatar" height="50px" width="50px" alt="${user.login}" src="${user.avatar_url}" />
									</a> 
									<a target="_blank" href="${user.html_url}">${user.login}</a> 
							</div>
			<p class="main__repos">Repositories:</p>
			`;

			mainList.appendChild(userItem);

			fetch(url + mainInput.value + "/repos")
				.then((response) => response.json())
				.then((repos) => {
					const reposList = document.createElement("ul");
					userItem.querySelector(".main__repos").appendChild(reposList);
					reposList.classList.add("main__repos__list");

					repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

					repos.forEach((repo) => {
						const DATE = (e) => {
							return new Date(e.created_at).toLocaleString().slice(0, 10);
						};
						console.log(repo);
						console.log(DATE(repo));
						const repoItem = document.createElement("li");
						repoItem.innerHTML = `
							<a class="main__repos__link" target="_blank" href="${
								repo.homepage ? repo.homepage : repo.html_url
							}">${
							repo.name
						} <i class="fa-solid fa-up-right-from-square"></i></a>
							<span class="main__repos__language">${repo.language}</span>
							<span class="main__repos__date">${DATE(repo)}</span>
					`;
						reposList.appendChild(repoItem);
					});
				});
		});
};

fetchFunc();

mainBtn.addEventListener("click", () => fetchFunc());
mainInput.addEventListener("keyup", (e) => e.key === "Enter" && fetchFunc());
