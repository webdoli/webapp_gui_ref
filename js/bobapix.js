document.addEventListener("DOMContentLoaded", function () {

    // property 속성 나타나기
    const buttons = document.querySelectorAll("#bobapix-middle .toolbar .button-wrapper span");
    const propertyPanel = document.querySelector("#bobapix-middle .property");
    const propertyTitle = propertyPanel.querySelector(".property-title");

    let activeKey = null; // 현재 열린 버튼 id/class 저장

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const key = button.getAttribute("id") || button.className;
            const close = document.createElement('span');
            close.className = 'icon-close';
            close.textContent = 'x';

            if (activeKey === key) {
                // 같은 버튼을 다시 클릭 → 창 닫기
                propertyPanel.classList.remove("active");
                activeKey = null;
            } else {
                // 다른 버튼 클릭 → 창 열고 제목 변경
                propertyTitle.textContent = key;
                propertyPanel.classList.add("active");
                activeKey = key;
                propertyTitle.appendChild( close );
            }
        });
    });

    // 하단 타임라인 부분
    const speed = document.getElementById("speed");
    const speedSettings = document.getElementById("speed-settings");
    const speedText = document.getElementById("speed-text");

    let isOpen = false;

    speed.addEventListener("click", (e) => {
        e.stopPropagation(); // 상위 클릭 막기
        isOpen = !isOpen;
        speedSettings.style.display = isOpen ? "block" : "none";
    });

    // 옵션 클릭 시 텍스트 변경
    document.querySelectorAll("#speed-settings .speed").forEach((el) => {
    el.addEventListener("click", () => {
        const selected = el.getAttribute("data-speed");
        speedText.textContent = `${selected}x`;
        isOpen = false;
        speedSettings.style.display = "none";
    });
    });

    // 바깥 클릭 시 드롭다운 닫기
    window.addEventListener("click", (e) => {
    if (!speed.contains(e.target)) {
        isOpen = false;
        speedSettings.style.display = "none";
    }
    });

});