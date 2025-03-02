export function formatMessageTime(date) {
  const dateObj = new Date(date);
  const options = { year : 'numeric', 
                    month: 'numeric', 
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  }
  const formattedDateTime = dateObj.toLocaleTimeString('en-IN', options);
  return formattedDateTime;
}