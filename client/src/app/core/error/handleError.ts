import { Observable, throwError } from "rxjs";

export function handleError(errMessage: string) {
    return (error: Error): Observable<never> => {
        console.error(`Error ${errMessage}: ${error.message}`);
        return throwError(() => error.message)
    }
}