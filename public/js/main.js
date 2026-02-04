document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('applicationForm');
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const successMessage = document.getElementById('successMessage');

    let currentStep = 0;

    // Helper to show/hide steps
    const updateSteps = () => {
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    };

    // Next Button Logic
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    updateSteps();
                }
            }
        });
    });

    // Prev Button Logic
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateSteps();
            }
        });
    });

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted!');

        if (!validateStep(currentStep)) {
            console.log('Validation failed');
            return;
        }

        // Collect all data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log('Form data collected:', data);

        try {
            console.log('Sending POST request to /submit-application');
            const response = await fetch('/submit-application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Response data:', result);

            if (result.success) {
                console.log('Success! Showing success message');
                form.style.display = 'none';
                successMessage.classList.remove('hidden');
                successMessage.classList.add('fade-in-up');
            } else {
                console.error('Submission failed:', result.message);
                alert('Submission failed: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    // Simple Validation
    const validateStep = (stepIndex) => {
        const currentStepEl = steps[stepIndex];
        const inputs = currentStepEl.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('border-red-500');
            } else {
                input.classList.remove('border-red-500');
            }
        });

        if (!isValid) {
            // Optional: Shake effect or toast message
            alert('Please fill in all required fields.');
        }

        return isValid;
    };
});
